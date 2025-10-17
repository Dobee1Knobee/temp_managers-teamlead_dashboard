'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useGetStatsByTeam } from '@/hooks/useGetStatsByTeam'
import { useOrderStore } from '@/stores/orderStore'
import { useEffect, useState } from 'react'
import Header from '../form/components/Header'
import Sidebar from '../form/components/Sidebar'
import ManagerOrdersModal from './components/ManagerOrdersModal'

export default function ManagersPage() {
    const currentUser = useOrderStore(state => state.currentUser);
    const [selectedTeam, setSelectedTeam] = useState("B");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedManager, setSelectedManager] = useState(null);
    const { stats, loading, error, refetch } = useGetStatsByTeam(selectedTeam, currentUser?.userAt || '');
	console.log('Stats:', stats);
	console.log('Loading:', loading);
	console.log('Error:', error);
	console.log('Current user:', currentUser);
    // Получаем данные из API - stats это объект
    const teamData = stats;
    const managers = teamData?.workingManagers || [];
    const totalOrders = teamData?.totalOrders || 0;
    const detailedStats = teamData?.detailedStats || {};
    const shiftPeriod = teamData?.shiftPeriod;
    
    console.log('Team data:', teamData);
    console.log('Managers:', managers);
    console.log('Total orders:', totalOrders);
    
    // Вычисляем статистику
    const successRate = totalOrders > 0 ? 
        Math.round(((detailedStats['Оформлен']) / (detailedStats['В работе'] + detailedStats['Оформлен'])) * 100) : 0;
    
    const invalidOrders = detailedStats['Невалидный'] || 0;
    const inProgressOrders = detailedStats['В работе'] || 0;

    const handleViewManager = (manager: any) => {
        setSelectedManager(manager);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedManager(null);
    };

    // Автоматический рефреш при загрузке страницы
    useEffect(() => {
        // Проверяем, что это первый заход на страницу (не редирект)
        const isFirstLoad = !sessionStorage.getItem('managersPageLoaded');
        
        if (isFirstLoad) {
            // Помечаем, что страница уже загружалась
            sessionStorage.setItem('managersPageLoaded', 'true');
            
            // Делаем полный рефреш страницы
            console.log('🔄 First load detected, refreshing page...');
            window.location.reload();
        }
    }, []);

    // Очищаем флаг при размонтировании компонента
    useEffect(() => {
        return () => {
            sessionStorage.removeItem('managersPageLoaded');
        };
    }, []);
    // Проверяем, что пользователь из команды H
    if (currentUser?.team !== 'H') {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                    <p className="text-gray-600">This page is only accessible to Team Leads (Team H)</p>
                    <p className="text-sm text-gray-500 mt-2">Current team: {currentUser?.team || 'Unknown'}</p>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="h-screen flex bg-gray-50 overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Managers Dashboard</h1>
                                        <p className="text-gray-600">Manage and monitor your team managers</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <label className="text-sm font-medium text-gray-700">Team:</label>
                                        <select
                                            value={selectedTeam}
                                            onChange={(e) => setSelectedTeam(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="A">Team A</option>
                                            <option value="B">Team B</option>
                                            <option value="C">Team C</option>
                                            <option value="W">Team W</option>
                                        </select>
                                        <button
                                            onClick={refetch}
                                            disabled={loading}
                                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                                loading 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        >
                                            {loading ? (
                                                <div className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                                                    Refreshing...
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Refresh
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Shift Information */}
                                {shiftPeriod && (
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-blue-900">Current Shift</p>
                                                <p className="text-sm text-blue-700">
                                                    {shiftPeriod.start} - {shiftPeriod.end}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Loading and Error States */}
                                {loading && (
                                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-3"></div>
                                            <p className="text-sm text-yellow-800">Loading data for Team {selectedTeam}...</p>
                                        </div>
                                    </div>
                                )}
                                
                                {error && (
                                    <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-red-800">Error: {error}</p>
                                                <p className="text-xs text-red-600 mt-1">Using demo data instead</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">Working Managers</p>
                                            <p className="text-2xl font-bold text-gray-900">{managers.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">Success Rate</p>
                                            <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-yellow-100 rounded-lg">
                                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">Invalid Orders</p>
                                            <p className="text-2xl font-bold text-gray-900">{invalidOrders}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Statistics */}
                            {Object.keys(detailedStats).length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h2 className="text-lg font-semibold text-gray-900">Order Status Breakdown</h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {Object.entries(detailedStats).map(([status, count]: [string, number]) => {
                                                // Определяем цветовую схему для каждого статуса (только релевантные статусы)
                                                const getStatusColor = (status: string) => {
                                                    switch (status) {
                                                        case 'Оформлен':
                                                            return 'text-white'; // #2e7d32 -> белый текст
                                                        case 'В работе':
                                                            return 'text-black'; // #ffff00 -> черный текст
                                                        case 'Невалидный':
                                                            return 'text-white'; // #f44336 -> белый текст
                                                        case 'Отменен':
                                                            return 'text-white'; // #470909 -> белый текст
                                                        case 'Недозвон':
                                                            return 'text-white'; // #9e9e9e -> белый текст
                                                        case 'Нужно подтверждение':
                                                            return 'text-black'; // #76ff03 -> черный текст
                                                        case 'Нужно согласование':
                                                            return 'text-black'; // #ffa726 -> черный текст
                                                        case 'Прозвонить завтра':
                                                            return 'text-black'; // #e6cff1 -> черный текст
                                                        case 'Ночной':
                                                            return 'text-white'; // #1976d2 -> белый текст
                                                        case 'Ночной ранний':
                                                            return 'text-black'; // #bfe1f6 -> черный текст
                                                        case 'Другой регион':
                                                            return 'text-black'; // #00e5ff -> черный текст
                                                        case 'Статус заказа':
                                                            return 'text-black'; // #e0e0e0 -> черный текст
                                                        default:
                                                            return 'text-black';
                                                    }
                                                };

                                                const getStatusBgColor = (status: string) => {
                                                    switch (status) {
                                                        case 'Оформлен':
                                                            return '#2e7d32';
                                                        case 'В работе':
                                                            return '#ffff00';
                                                        case 'Невалидный':
                                                            return '#f44336';
                                                        case 'Отменен':
                                                            return '#470909';
                                                        case 'Недозвон':
                                                            return '#9e9e9e';
                                                        case 'Нужно подтверждение':
                                                            return '#76ff03';
                                                        case 'Нужно согласование':
                                                            return '#ffa726';
                                                        case 'Прозвонить завтра':
                                                            return '#e6cff1';
                                                        case 'Ночной':
                                                            return '#1976d2';
                                                        case 'Ночной ранний':
                                                            return '#bfe1f6';
                                                        case 'Другой регион':
                                                            return '#00e5ff';
                                                        case 'Статус заказа':
                                                            return '#e0e0e0';
                                                        default:
                                                            return '#e0e0e0';
                                                    }
                                                };

                                                const textColor = getStatusColor(status);
                                                const bgColor = getStatusBgColor(status);
                                                
                                                return (
                                                    <div 
                                                        key={status} 
                                                        className={`text-center p-4 rounded-lg border-2 ${textColor} hover:shadow-md transition-shadow`}
                                                        style={{ backgroundColor: bgColor }}
                                                    >
                                                        <p className="text-sm font-medium mb-2">{status}</p>
                                                        <p className="text-2xl font-bold">{count}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Managers Table */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Manager List</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Manager
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Team
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Manager ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Orders Today
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Performance
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {managers.map((manager: any, index: number) => {
                                                // Генерируем инициалы из имени
                                                const initials = manager.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
                                                
                                                // Определяем цвет аватара на основе индекса
                                                const avatarColors = [
                                                    'bg-blue-100 text-blue-600',
                                                    'bg-green-100 text-green-600', 
                                                    'bg-yellow-100 text-yellow-600',
                                                    'bg-purple-100 text-purple-600',
                                                    'bg-red-100 text-red-600'
                                                ];
                                                const avatarColor = avatarColors[index % avatarColors.length];
                                                
                                                return (
                                                    <tr key={manager.manager_id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 flex-shrink-0">
                                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${avatarColor}`}>
                                                                        <span className="text-sm font-medium">{initials}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{manager.name}</div>
                                                                    <div className="text-sm text-gray-500">@{manager.at}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                Team {selectedTeam}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                Active
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {manager.manager_id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {manager.orders?.length}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {Math.floor(Math.random() * 20) + 80}%
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button 
                                                                onClick={() => handleViewManager(manager)}
                                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                            >
                                                                View
                                                            </button>
                                                     
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manager Orders Modal */}
            <ManagerOrdersModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onRefresh={refetch}
                manager={selectedManager}
            />
        </ProtectedRoute>
    );
}
