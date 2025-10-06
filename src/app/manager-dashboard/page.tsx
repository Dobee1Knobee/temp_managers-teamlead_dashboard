"use client";

import Header from "@/app/form/components/Header";
import Sidebar from "@/app/form/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useManagerStats } from "@/hooks/useManagerStats";
import { useOrderStore } from "@/stores/orderStore";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { ManagerDashboardHeader } from "./components/ManagerDashboardHeader";
import { ManagerLeadsTable } from "./components/ManagerLeadsTable";
import { ManagerStatsCards } from "./components/ManagerStatsCards";

export default function ManagerDashboard() {
    const currentUser = useOrderStore(state => state.currentUser);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const {
        stats,
        leadsData,
        isLoading,
        error,
        refreshStats
    } = useManagerStats(currentUser?.userAt);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshStats();
        } finally {
            setIsRefreshing(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">Загрузка данных пользователя...</p>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="h-screen flex bg-gray-50 overflow-hidden">
                {/* Sidebar - фиксированная слева */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header - фиксированный сверху */}
                    <Header />

                    {/* Content - скроллируемая область */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Кастомный заголовок дашборда */}
                        <ManagerDashboardHeader 
                            userName={currentUser.userName}
                            userAt={currentUser.userAt}
                            team={currentUser.team}
                            onRefresh={handleRefresh}
                            isRefreshing={isRefreshing}
                        />

                        <div className="p-6 space-y-6">
                            {/* Статистические карточки */}
                            <ManagerStatsCards 
                                stats={stats}
                                isLoading={isLoading}
                            />

                            {/* Таблица лидов */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <TrendingUp className="w-5 h-5 text-blue-600" />
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Детализация по лидам
                                            </h2>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Обновлено: {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString('ru-RU') : 'Никогда'}
                                        </div>
                                    </div>
                                </div>
                                
                                <ManagerLeadsTable 
                                    leadsData={leadsData}
                                    isLoading={isLoading}
                                    error={error}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
