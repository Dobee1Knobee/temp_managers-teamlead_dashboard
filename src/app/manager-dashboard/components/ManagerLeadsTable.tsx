// src/app/manager-dashboard/components/ManagerLeadsTable.tsx
"use client";

import { LeadData, LeadStatus } from "@/types/managerStats";
import { AlertCircle, Calendar, CheckCircle, Clock, Phone, User, XCircle } from "lucide-react";
import { useState } from "react";

interface ManagerLeadsTableProps {
    leadsData: LeadData[];
    isLoading: boolean;
    error: string | null;
}

export function ManagerLeadsTable({ leadsData, isLoading, error }: ManagerLeadsTableProps) {
    const [sortField, setSortField] = useState<keyof LeadData>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const getStatusIcon = (status: LeadStatus) => {
        switch (status) {
            case LeadStatus.ENTERED:
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case LeadStatus.NOT_ENTERED:
                return <XCircle className="w-4 h-4 text-red-500" />;
            case LeadStatus.IN_PROGRESS:
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case LeadStatus.CANCELLED:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusText = (status: LeadStatus) => {
        switch (status) {
            case LeadStatus.ENTERED:
                return "Занесен";
            case LeadStatus.NOT_ENTERED:
                return "Не занесен";
            case LeadStatus.IN_PROGRESS:
                return "В процессе";
            case LeadStatus.CANCELLED:
                return "Отменен";
            default:
                return "Неизвестно";
        }
    };

    const getStatusColor = (status: LeadStatus) => {
        switch (status) {
            case LeadStatus.ENTERED:
                return "bg-green-100 text-green-800";
            case LeadStatus.NOT_ENTERED:
                return "bg-red-100 text-red-800";
            case LeadStatus.IN_PROGRESS:
                return "bg-yellow-100 text-yellow-800";
            case LeadStatus.CANCELLED:
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleSort = (field: keyof LeadData) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedLeads = [...leadsData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' 
                ? aValue - bValue
                : bValue - aValue;
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
            return sortDirection === 'asc' 
                ? aValue.getTime() - bValue.getTime()
                : bValue.getTime() - aValue.getTime();
        }
        
        return 0;
    });

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex space-x-4">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-600 mb-2">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Ошибка загрузки данных</p>
                </div>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    if (leadsData.length === 0) {
        return (
            <div className="p-6 text-center">
                <div className="text-gray-400 mb-2">
                    <User className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Нет данных о лидах</p>
                </div>
                <p className="text-gray-600">Лиды за текущую смену не найдены</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('clientId')}
                        >
                            <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>Client ID</span>
                            </div>
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('phone')}
                        >
                            <div className="flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>Телефон</span>
                            </div>
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('leadId')}
                        >
                            <span>Lead ID</span>
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('status')}
                        >
                            <span>Статус</span>
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('createdAt')}
                        >
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Создан</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedLeads.map((lead, index) => (
                        <tr key={lead.clientId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {lead.clientId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {lead.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {lead.leadId || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(lead.status)}
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                                        {getStatusText(lead.status)}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(lead.createdAt).toLocaleString('ru-RU')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
