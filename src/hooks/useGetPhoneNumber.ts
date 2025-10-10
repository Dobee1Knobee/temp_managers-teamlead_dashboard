// Чистая утилита: получить телефон по order_id/at/team
export async function getPhoneNumber(at: string, team: string, order_id: string): Promise<string | null> {
    const base = 'https://bot-crm-backend-756832582185.us-central1.run.app';
    const url = `${base}/api/current-available-claims/getPhone/${encodeURIComponent(order_id)}/${encodeURIComponent(at)}/${encodeURIComponent(team)}`;

    try {
        const res = await fetch(url, { method: 'GET' });
        
        if (!res.ok) {
            console.error(`API error: ${res.status} ${res.statusText}`);
            return null;
        }
        
        const data = await res.json();
        
        // Проверяем на ошибки от API
        if (data.error) {
            console.error('API returned error:', data.error);
            return null;
        }
        
        if (data && typeof data.phone === 'string') {
            return data.phone;
        }
        
        console.warn('API response missing phone field:', data);
        return null;
    } catch (e) {
        console.error('Failed to fetch phone number', e);
        return null;
    }
}