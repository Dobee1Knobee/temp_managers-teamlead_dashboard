import { useEffect, useState } from 'react'
interface StatsByTeam{
	team: string;
	shiftPeriod: {
		start: string;
		end: string;
	};
	workingManagers: {
		at: string;
		name: string;
		manager_id: string;
		orders: string[];
	}[];
	totalOrders: number;
	statistics: string;
	detailedStats: {
		[key: string]: number;
	};
}
// {
// 	"team": "B",
// 	"shiftPeriod": {
// 			"start": "17.10.2025, 15:00:00",
// 			"end": "18.10.2025, 04:00:00"
// 	},
// 	"workingManagers": [
// 			{
// 					"at": "Balyetca",
// 					"name": "Alexey Balashov",
// 					"manager_id": "AD"
// 			},
// 			{
// 					"at": "stealthespirit",
// 					"name": "Maria Chigareva",
// 					"manager_id": "N"
// 			},
// 			{
// 					"at": "devapi1",
// 					"name": "Egor Biriukov",
// 					"manager_id": "EGG"
// 			},
// 			{
// 					"at": "Lenny_Vee",
// 					"name": "Vaikosen Ogheneochuko",
// 					"manager_id": "V"
// 			},
// 			{
// 					"at": "mcdmn143",
// 					"name": "MacDonald Ndalama",
// 					"manager_id": "M"
// 			}
// 	],
// 	"totalOrders": 1,
// 	"statistics": "Невалидный - 1",
// 	"detailedStats": {
// 			"Отменен": 0,
// 			"Другой регион": 0,
// 			"Невалидный": 1,
// 			"Недозвон": 0,
// 			"В работе": 0,
// 			"Ночной": 0,
// 			"Ночной ранний": 0,
// 			"Нужно подтверждение": 0,
// 			"Нужно согласование": 0,
// 			"Оформлен": 0,
// 			"Прозвонить завтра": 0,
// 			"Статус заказа": 0
// 	}
// }
export const useGetStatsByTeam = (team:string, at:string) => {
    const [stats, setStats] = useState<StatsByTeam | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`https://bot-crm-backend-756832582185.us-central1.run.app/api/statistics/team/${team}/${at}`);
            setStats(await res.json() as StatsByTeam);
        }catch(err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        // Запускаем запрос только если есть team и at
        if (team && at) {
            fetchStats();
        }
    }, [team, at]);

    // Обновляем данные при возврате на вкладку
    useEffect(() => {
        const handleFocus = () => {
            if (team && at) {
                console.log('🔄 Window focused, refreshing stats...');
                fetchStats();
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [team, at]);

    return { stats, loading, error, refetch: fetchStats };
}