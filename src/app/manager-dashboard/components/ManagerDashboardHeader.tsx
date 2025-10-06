// src/app/manager-dashboard/components/ManagerDashboardHeader.tsx
"use client";

import { useOrderStore } from "@/stores/orderStore";
import { Clock, Database, RefreshCw, Server, User, Users, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";

interface ManagerDashboardHeaderProps {
    userName: string;
    userAt: string;
    team: string;
    onRefresh: () => void;
    isRefreshing: boolean;
}

export function ManagerDashboardHeader({ 
    userName, 
    userAt, 
    team, 
    onRefresh, 
    isRefreshing 
}: ManagerDashboardHeaderProps) {
    const currentTime = new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const { isSocketConnected } = useOrderStore();
    const [useMockData, setUseMockData] = useState(true);

    const toggleDataSource = () => {
        setUseMockData(!useMockData);
        // Здесь можно добавить логику для переключения источника данных
        console.log('Switching to:', useMockData ? 'Real API' : 'Mock Data');
    };

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <User className="w-6 h-6 text-blue-600" />
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Дашборд менеджера
                            </h1>
                            <p className="text-sm text-gray-600">
                                {userName} ({userAt})
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>Команда: {team}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{currentTime}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                        {isSocketConnected ? (
                            <div className="flex items-center space-x-1 text-green-600">
                                <Wifi className="w-4 h-4" />
                                <span>Онлайн</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-1 text-red-600">
                                <WifiOff className="w-4 h-4" />
                                <span>Офлайн</span>
                            </div>
                        )}
                    </div>

                    {/* Переключатель источника данных */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={toggleDataSource}
                            className={`
                                flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors
                                ${useMockData 
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }
                            `}
                            title={useMockData ? 'Используются мок данные' : 'Используется реальный API'}
                        >
                            {useMockData ? (
                                <>
                                    <Database className="w-3 h-3" />
                                    <span>Мок</span>
                                </>
                            ) : (
                                <>
                                    <Server className="w-3 h-3" />
                                    <span>API</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className={`
                        flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors
                        ${isRefreshing 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                        }
                    `}
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Обновить</span>
                </button>
            </div>
        </div>
    );
}
