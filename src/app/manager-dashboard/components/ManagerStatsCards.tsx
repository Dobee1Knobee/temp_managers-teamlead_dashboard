// src/app/manager-dashboard/components/ManagerStatsCards.tsx
"use client";

import { ManagerStats } from "@/types/managerStats";
import { Target, UserPlus, Users, UserX } from "lucide-react";

interface ManagerStatsCardsProps {
    stats: ManagerStats | null;
    isLoading: boolean;
}

export function ManagerStatsCards({ stats, isLoading }: ManagerStatsCardsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-center text-gray-500">
                        <p>Нет данных для отображения</p>
                    </div>
                </div>
            </div>
        );
    }

    const { shiftStats } = stats;

    const cards = [
        {
            title: "Уникальные клиенты",
            value: shiftStats.uniqueClients,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
        },
        {
            title: "Всего лидов",
            value: shiftStats.totalLeads,
            icon: Target,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
        },
        {
            title: "Занесенные лиды",
            value: shiftStats.enteredLeads,
            icon: UserPlus,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200"
        },
        {
            title: "Не занесенные лиды",
            value: shiftStats.notEnteredLeads,
            icon: UserX,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                    <div 
                        key={index}
                        className={`
                            bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md
                            ${card.borderColor}
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {card.value}
                                </p>
                            </div>
                            <div className={`
                                p-3 rounded-lg ${card.bgColor}
                            `}>
                                <IconComponent className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

