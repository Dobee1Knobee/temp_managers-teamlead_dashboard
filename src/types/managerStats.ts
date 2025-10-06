// src/types/managerStats.ts
// Типы данных для статистики менеджера

export interface ManagerStats {
    // Основная статистика за смену
    shiftStats: {
        uniqueClients: number;        // Количество уникальных клиентов за смену
        totalLeads: number;           // Общее количество лидов
        enteredLeads: number;        // Количество занесенных лидов
        notEnteredLeads: number;     // Количество не занесенных лидов
        conversionRate: number;       // Процент конверсии (занесенные/общие)
    };
    
    // Временные метки
    shiftStart: Date;                // Начало смены
    shiftEnd?: Date;                 // Конец смены (если смена завершена)
    lastUpdated: Date;               // Последнее обновление статистики
    
    // Информация о менеджере
    managerInfo: {
        userId: string;
        userName: string;
        userAt: string;
        team: string;
        managerId: string;
    };
}

export interface LeadData {
    clientId: number;                // ID клиента
    phone: string;                   // Номер телефона
    leadId: string;                  // ID лида
    status: LeadStatus;              // Статус лида
    createdAt: Date;                 // Дата создания
    updatedAt: Date;                 // Дата последнего обновления
    orderId?: string;                // ID заказа (если лид занесен)
    orderTotal?: number;             // Сумма заказа (если лид занесен)
    customerName?: string;           // Имя клиента
    city?: string;                   // Город
    address?: string;                // Адрес
}

export enum LeadStatus {
    ENTERED = "entered",             // Занесен в систему
    NOT_ENTERED = "not_entered",     // Не занесен
    IN_PROGRESS = "in_progress",     // В процессе обработки
    CANCELLED = "cancelled"          // Отменен
}

export interface ManagerStatsResponse {
    success: boolean;
    stats: ManagerStats;
    leads: LeadData[];
    error?: string;
}

export interface ManagerStatsFilters {
    dateFrom?: string;               // Фильтр по дате начала
    dateTo?: string;                 // Фильтр по дате окончания
    status?: LeadStatus;             // Фильтр по статусу лида
    team?: string;                   // Фильтр по команде
}

