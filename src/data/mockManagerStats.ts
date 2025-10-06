// src/data/mockManagerStats.ts
import { LeadData, LeadStatus, ManagerStats } from '@/types/managerStats';

// Мок данные для статистики менеджера
export const mockManagerStats: ManagerStats = {
    shiftStats: {
        uniqueClients: 24,
        totalLeads: 35,
        enteredLeads: 18,
        notEnteredLeads: 17,
        conversionRate: 51.4
    },
    shiftStart: new Date('2024-01-15T09:00:00'),
    shiftEnd: undefined, // Смена еще не завершена
    lastUpdated: new Date(),
    managerInfo: {
        userId: 'user123',
        userName: 'Иван Петров',
        userAt: '@ivan_petrov',
        team: 'A',
        managerId: 'manager_001'
    }
};

// Мок данные для лидов
export const mockLeadsData: LeadData[] = [
    {
        clientId: 1001,
        phone: '(555) 123-4567',
        leadId: 'EC0925001',
        status: LeadStatus.ENTERED,
        createdAt: new Date('2024-01-15T09:15:00'),
        updatedAt: new Date('2024-01-15T09:45:00'),
        orderId: 'ORD-001',
        orderTotal: 2500,
        customerName: 'Анна Смирнова',
        city: 'Москва',
        address: 'ул. Тверская, д. 15, кв. 42'
    },
    {
        clientId: 1002,
        phone: '(555) 234-5678',
        leadId: 'EC0925002',
        status: LeadStatus.ENTERED,
        createdAt: new Date('2024-01-15T09:30:00'),
        updatedAt: new Date('2024-01-15T10:15:00'),
        orderId: 'ORD-002',
        orderTotal: 1800,
        customerName: 'Михаил Козлов',
        city: 'Санкт-Петербург',
        address: 'пр. Невский, д. 28, кв. 15'
    },
    {
        clientId: 1003,
        phone: '(555) 345-6789',
        leadId: '',
        status: LeadStatus.NOT_ENTERED,
        createdAt: new Date('2024-01-15T10:00:00'),
        updatedAt: new Date('2024-01-15T10:00:00'),
        customerName: 'Елена Волкова',
        city: 'Казань',
        address: 'ул. Баумана, д. 5, кв. 8'
    },
    {
        clientId: 1004,
        phone: '(555) 456-7890',
        leadId: 'EC0925003',
        status: LeadStatus.ENTERED,
        createdAt: new Date('2024-01-15T10:20:00'),
        updatedAt: new Date('2024-01-15T11:00:00'),
        orderId: 'ORD-003',
        orderTotal: 3200,
        customerName: 'Дмитрий Соколов',
        city: 'Екатеринбург',
        address: 'ул. Ленина, д. 12, кв. 25'
    },
    {
        clientId: 1005,
        phone: '(555) 567-8901',
        leadId: '',
        status: LeadStatus.IN_PROGRESS,
        createdAt: new Date('2024-01-15T10:45:00'),
        updatedAt: new Date('2024-01-15T11:30:00'),
        customerName: 'Ольга Морозова',
        city: 'Новосибирск',
        address: 'ул. Красный проспект, д. 33, кв. 12'
    },
    {
        clientId: 1006,
        phone: '(555) 678-9012',
        leadId: '',
        status: LeadStatus.NOT_ENTERED,
        createdAt: new Date('2024-01-15T11:10:00'),
        updatedAt: new Date('2024-01-15T11:10:00'),
        customerName: 'Сергей Новиков',
        city: 'Ростов-на-Дону',
        address: 'ул. Большая Садовая, д. 7, кв. 18'
    },
    {
        clientId: 1007,
        phone: '(555) 789-0123',
        leadId: 'EC0925004',
        status: LeadStatus.ENTERED,
        createdAt: new Date('2024-01-15T11:25:00'),
        updatedAt: new Date('2024-01-15T12:00:00'),
        orderId: 'ORD-004',
        orderTotal: 2100,
        customerName: 'Татьяна Лебедева',
        city: 'Краснодар',
        address: 'ул. Красная, д. 22, кв. 7'
    },
    {
        clientId: 1008,
        phone: '(555) 890-1234',
        leadId: '',
        status: LeadStatus.CANCELLED,
        createdAt: new Date('2024-01-15T11:40:00'),
        updatedAt: new Date('2024-01-15T12:15:00'),
        customerName: 'Александр Федоров',
        city: 'Воронеж',
        address: 'ул. Плехановская, д. 14, кв. 33'
    },
    {
        clientId: 1009,
        phone: '(555) 901-2345',
        leadId: 'EC0925005',
        status: LeadStatus.ENTERED,
        createdAt: new Date('2024-01-15T12:00:00'),
        updatedAt: new Date('2024-01-15T12:30:00'),
        orderId: 'ORD-005',
        orderTotal: 2800,
        customerName: 'Мария Кузнецова',
        city: 'Самара',
        address: 'ул. Молодогвардейская, д. 9, кв. 21'
    },
    {
        clientId: 1010,
        phone: '(555) 012-3456',
        leadId: '',
        status: LeadStatus.NOT_ENTERED,
        createdAt: new Date('2024-01-15T12:15:00'),
        updatedAt: new Date('2024-01-15T12:15:00'),
        customerName: 'Владимир Попов',
        city: 'Уфа',
        address: 'ул. Ленина, д. 45, кв. 16'
    },
    {
        clientId: 1011,
        phone: '(555) 123-4567',
        leadId: 'EC0925006',
        status: LeadStatus.ENTERED,
        createdAt: new Date('2024-01-15T12:30:00'),
        updatedAt: new Date('2024-01-15T13:00:00'),
        orderId: 'ORD-006',
        orderTotal: 1950,
        customerName: 'Наталья Васильева',
        city: 'Пермь',
        address: 'ул. Комсомольский проспект, д. 18, кв. 9'
    },
    {
        clientId: 1012,
        phone: '(555) 234-5678',
        leadId: '',
        status: LeadStatus.IN_PROGRESS,
        createdAt: new Date('2024-01-15T12:45:00'),
        updatedAt: new Date('2024-01-15T13:20:00'),
        customerName: 'Игорь Семенов',
        city: 'Волгоград',
        address: 'ул. Мира, д. 11, кв. 14'
    },
    {
        clientId: 1013,
        phone: '(555) 345-6789',
        leadId: '',
        status: LeadStatus.NOT_ENTERED,
        createdAt: new Date('2024-01-15T13:00:00'),
        updatedAt: new Date('2024-01-15T13:00:00'),
        customerName: 'Людмила Голубева',
        city: 'Красноярск',
        address: 'ул. Мира, д. 25, кв. 6'
    },
    {
        clientId: 1014,
        phone: '(555) 456-7890',
        leadId: 'EC0925007',
        status: LeadStatus.ENTERED,
        createdAt: new Date('2024-01-15T13:15:00'),
        updatedAt: new Date('2024-01-15T13:45:00'),
        orderId: 'ORD-007',
        orderTotal: 2400,
        customerName: 'Андрей Орлов',
        city: 'Саратов',
        address: 'ул. Московская, д. 3, кв. 28'
    },
    {
        clientId: 1015,
        phone: '(555) 567-8901',
        leadId: '',
        status: LeadStatus.NOT_ENTERED,
        createdAt: new Date('2024-01-15T13:30:00'),
        updatedAt: new Date('2024-01-15T13:30:00'),
        customerName: 'Екатерина Медведева',
        city: 'Тюмень',
        address: 'ул. Республики, д. 16, кв. 11'
    }
];

// Функция для генерации случайных обновлений статистики
export const generateMockStatsUpdate = (): ManagerStats => {
    const baseStats = { ...mockManagerStats };
    
    // Небольшие случайные изменения
    const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, или 1
    
    return {
        ...baseStats,
        shiftStats: {
            ...baseStats.shiftStats,
            uniqueClients: Math.max(0, baseStats.shiftStats.uniqueClients + variation),
            totalLeads: Math.max(0, baseStats.shiftStats.totalLeads + variation),
            enteredLeads: Math.max(0, baseStats.shiftStats.enteredLeads + variation),
            notEnteredLeads: Math.max(0, baseStats.shiftStats.notEnteredLeads + variation),
            conversionRate: baseStats.shiftStats.totalLeads > 0 
                ? (baseStats.shiftStats.enteredLeads / baseStats.shiftStats.totalLeads) * 100 
                : 0
        },
        lastUpdated: new Date()
    };
};

// Функция для генерации нового лида
export const generateMockLead = (): LeadData => {
    const clientId = 2000 + Math.floor(Math.random() * 1000);
    const phoneNumber = `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    const statuses = [LeadStatus.ENTERED, LeadStatus.NOT_ENTERED, LeadStatus.IN_PROGRESS, LeadStatus.CANCELLED];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Генерируем Lead ID только для занесенных лидов
    let leadId = '';
    if (status === LeadStatus.ENTERED) {
        const randomNumber = Math.floor(Math.random() * 10000000) + 1000000; // 7-значное число
        leadId = `EC${randomNumber}`;
    }
    
    const cities = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск', 'Краснодар'];
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    const names = ['Алексей', 'Мария', 'Дмитрий', 'Анна', 'Сергей', 'Елена', 'Андрей', 'Ольга'];
    const surnames = ['Иванов', 'Петрова', 'Сидоров', 'Козлова', 'Морозов', 'Волкова', 'Новиков', 'Лебедева'];
    const name = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
    
    const lead: LeadData = {
        clientId,
        phone: phoneNumber,
        leadId,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
        customerName: name,
        city,
        address: `ул. Примерная, д. ${Math.floor(Math.random() * 50) + 1}, кв. ${Math.floor(Math.random() * 100) + 1}`
    };
    
    if (status === LeadStatus.ENTERED) {
        lead.orderId = `ORD-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        lead.orderTotal = Math.floor(Math.random() * 3000) + 1000; // от 1000 до 4000
    }
    
    return lead;
};
