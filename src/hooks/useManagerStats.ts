// src/hooks/useManagerStats.ts
import { generateMockLead, generateMockStatsUpdate, mockLeadsData, mockManagerStats } from '@/data/mockManagerStats';
import { useOrderStore } from '@/stores/orderStore';
import { LeadData, ManagerStats, ManagerStatsFilters, ManagerStatsResponse } from '@/types/managerStats';
import { useCallback, useEffect, useState } from 'react';

const BASE_URL = 'https://bot-crm-backend-756832582185.us-central1.run.app/api';

// Переменная для переключения между мок данными и реальным API
const USE_MOCK_DATA = true; // Установите в false для использования реального API

interface UseManagerStatsReturn {
    stats: ManagerStats | null;
    leadsData: LeadData[];
    isLoading: boolean;
    error: string | null;
    refreshStats: () => Promise<void>;
    fetchStatsWithFilters: (filters: ManagerStatsFilters) => Promise<void>;
}

export const useManagerStats = (
    userAt?: string,
    autoRefresh: boolean = true,
    refreshInterval: number = 30000 // 30 секунд
): UseManagerStatsReturn => {
    const [stats, setStats] = useState<ManagerStats | null>(null);
    const [leadsData, setLeadsData] = useState<LeadData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { isSocketConnected, socket } = useOrderStore();

    // Функция для получения мок данных
    const fetchMockStats = useCallback(async (filters?: ManagerStatsFilters) => {
        console.log('Using mock data for manager stats');
        
        setIsLoading(true);
        setError(null);

        // Имитируем задержку сети
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Применяем фильтры к мок данным
            let filteredLeads = [...mockLeadsData];
            
            if (filters) {
                if (filters.status) {
                    filteredLeads = filteredLeads.filter(lead => lead.status === filters.status);
                }
                if (filters.dateFrom) {
                    const fromDate = new Date(filters.dateFrom);
                    filteredLeads = filteredLeads.filter(lead => lead.createdAt >= fromDate);
                }
                if (filters.dateTo) {
                    const toDate = new Date(filters.dateTo);
                    filteredLeads = filteredLeads.filter(lead => lead.createdAt <= toDate);
                }
            }

            // Обновляем статистику на основе отфильтрованных данных
            const enteredLeads = filteredLeads.filter(lead => lead.status === 'entered').length;
            const notEnteredLeads = filteredLeads.filter(lead => lead.status === 'not_entered').length;
            const totalLeads = filteredLeads.length;
            const uniqueClients = new Set(filteredLeads.map(lead => lead.clientId)).size;

            const mockStats: ManagerStats = {
                ...mockManagerStats,
                shiftStats: {
                    uniqueClients,
                    totalLeads,
                    enteredLeads,
                    notEnteredLeads,
                    conversionRate: totalLeads > 0 ? (enteredLeads / totalLeads) * 100 : 0
                },
                lastUpdated: new Date()
            };

            setStats(mockStats);
            setLeadsData(filteredLeads);
            console.log('Mock manager stats loaded successfully:', mockStats);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            setError(errorMessage);
            console.error('Error loading mock manager stats:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Функция для получения реальных данных через API
    const fetchRealStats = useCallback(async (filters?: ManagerStatsFilters) => {
        if (!userAt) {
            setError('User AT не найден');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Формируем URL с параметрами
            const url = new URL(`${BASE_URL}/manager/stats/${encodeURIComponent(userAt)}`);
            
            // Добавляем фильтры если есть
            if (filters) {
                if (filters.dateFrom) url.searchParams.append('dateFrom', filters.dateFrom);
                if (filters.dateTo) url.searchParams.append('dateTo', filters.dateTo);
                if (filters.status) url.searchParams.append('status', filters.status);
                if (filters.team) url.searchParams.append('team', filters.team);
            }

            console.log('Fetching manager stats:', url.toString());

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
                }
                throw new Error(`Ошибка получения статистики: ${response.statusText}`);
            }

            const data: ManagerStatsResponse = await response.json();
            
            if (data.success) {
                setStats(data.stats);
                setLeadsData(data.leads);
                console.log('Manager stats loaded successfully:', data.stats);
            } else {
                throw new Error(data.error || 'Неизвестная ошибка при получении статистики');
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            setError(errorMessage);
            console.error('Error fetching manager stats:', err);
        } finally {
            setIsLoading(false);
        }
    }, [userAt]);

    // Основная функция для получения статистики
    const fetchStats = useCallback(async (filters?: ManagerStatsFilters) => {
        if (USE_MOCK_DATA) {
            await fetchMockStats(filters);
        } else {
            await fetchRealStats(filters);
        }
    }, [fetchMockStats, fetchRealStats]);

    // Функция для обновления статистики
    const refreshStats = useCallback(async () => {
        await fetchStats();
    }, [fetchStats]);

    // Функция для получения статистики с фильтрами
    const fetchStatsWithFilters = useCallback(async (filters: ManagerStatsFilters) => {
        await fetchStats(filters);
    }, [fetchStats]);

    // WebSocket обработчики для реального времени (только для мок данных)
    useEffect(() => {
        if (!socket || !isSocketConnected || !userAt || !USE_MOCK_DATA) return;

        console.log('Setting up WebSocket listeners for mock manager stats');

        // Слушаем обновления статистики менеджера
        const handleManagerStatsUpdate = (data: { userAt: string; stats: ManagerStats; leads: LeadData[] }) => {
            if (data.userAt === userAt) {
                console.log('Received real-time manager stats update:', data);
                setStats(data.stats);
                setLeadsData(data.leads);
            }
        };

        // Слушаем новые лиды
        const handleNewLead = (data: { userAt: string; lead: LeadData }) => {
            if (data.userAt === userAt) {
                console.log('Received new lead:', data.lead);
                setLeadsData(prev => [data.lead, ...prev]);
                // Обновляем статистику
                setStats(prev => prev ? {
                    ...prev,
                    shiftStats: {
                        ...prev.shiftStats,
                        totalLeads: prev.shiftStats.totalLeads + 1,
                        notEnteredLeads: data.lead.status === 'not_entered' 
                            ? prev.shiftStats.notEnteredLeads + 1 
                            : prev.shiftStats.notEnteredLeads
                    },
                    lastUpdated: new Date()
                } : null);
            }
        };

        // Слушаем обновления статуса лида
        const handleLeadStatusUpdate = (data: { userAt: string; leadId: string; newStatus: string; orderId?: string; orderTotal?: number }) => {
            if (data.userAt === userAt) {
                console.log('Received lead status update:', data);
                setLeadsData(prev => prev.map(lead => 
                    lead.leadId === data.leadId 
                        ? { 
                            ...lead, 
                            status: data.newStatus as any,
                            orderId: data.orderId,
                            orderTotal: data.orderTotal,
                            updatedAt: new Date()
                        }
                        : lead
                ));
                
                // Обновляем статистику
                setStats(prev => {
                    if (!prev) return null;
                    
                    const wasEntered = prev.shiftStats.enteredLeads;
                    const wasNotEntered = prev.shiftStats.notEnteredLeads;
                    
                    let newEntered = wasEntered;
                    let newNotEntered = wasNotEntered;
                    
                    if (data.newStatus === 'entered') {
                        newEntered = wasEntered + 1;
                        newNotEntered = Math.max(0, wasNotEntered - 1);
                    } else if (data.newStatus === 'not_entered') {
                        newNotEntered = wasNotEntered + 1;
                        newEntered = Math.max(0, wasEntered - 1);
                    }
                    
                    return {
                        ...prev,
                        shiftStats: {
                            ...prev.shiftStats,
                            enteredLeads: newEntered,
                            notEnteredLeads: newNotEntered,
                            conversionRate: prev.shiftStats.totalLeads > 0 
                                ? (newEntered / prev.shiftStats.totalLeads) * 100 
                                : 0
                        },
                        lastUpdated: new Date()
                    };
                });
            }
        };

        // Подписываемся на события
        socket.on('manager-stats-update', handleManagerStatsUpdate);
        socket.on('new-lead', handleNewLead);
        socket.on('lead-status-update', handleLeadStatusUpdate);

        // Отписываемся при размонтировании
        return () => {
            socket.off('manager-stats-update', handleManagerStatsUpdate);
            socket.off('new-lead', handleNewLead);
            socket.off('lead-status-update', handleLeadStatusUpdate);
        };
    }, [socket, isSocketConnected, userAt]);

    // Автоматическое обновление при подключении к WebSocket
    useEffect(() => {
        if (userAt && isSocketConnected) {
            fetchStats();
        }
    }, [userAt, isSocketConnected, fetchStats]);

    // Автоматическое обновление по интервалу (только если WebSocket не подключен)
    useEffect(() => {
        if (!autoRefresh || !userAt || isSocketConnected) return;

        const interval = setInterval(() => {
            fetchStats();
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [autoRefresh, userAt, refreshInterval, isSocketConnected, fetchStats]);

    // Для мок данных: имитируем периодические обновления
    useEffect(() => {
        if (!USE_MOCK_DATA || !userAt) return;

        const mockUpdateInterval = setInterval(() => {
            // Иногда добавляем новый лид
            if (Math.random() < 0.3) { // 30% вероятность
                const newLead = generateMockLead();
                setLeadsData(prev => [newLead, ...prev]);
                
                setStats(prev => prev ? {
                    ...prev,
                    shiftStats: {
                        ...prev.shiftStats,
                        totalLeads: prev.shiftStats.totalLeads + 1,
                        uniqueClients: prev.shiftStats.uniqueClients + 1,
                        notEnteredLeads: newLead.status === 'not_entered' 
                            ? prev.shiftStats.notEnteredLeads + 1 
                            : prev.shiftStats.notEnteredLeads,
                        conversionRate: prev.shiftStats.totalLeads > 0 
                            ? (prev.shiftStats.enteredLeads / (prev.shiftStats.totalLeads + 1)) * 100 
                            : 0
                    },
                    lastUpdated: new Date()
                } : null);
            }
            
            // Иногда обновляем существующую статистику
            if (Math.random() < 0.2) { // 20% вероятность
                setStats(prev => prev ? generateMockStatsUpdate() : null);
            }
        }, 10000); // Каждые 10 секунд

        return () => clearInterval(mockUpdateInterval);
    }, [userAt]);

    return {
        stats,
        leadsData,
        isLoading,
        error,
        refreshStats,
        fetchStatsWithFilters
    };
};
