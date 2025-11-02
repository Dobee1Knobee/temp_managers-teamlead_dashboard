'use client'

import { useOrderStore } from '@/stores/orderStore'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type ClaimedOrderLite = {
    _id: string
    formId: string
    clientName: string
    createdAt: Date | null
    city?: string
    state?: string
    text?: string
    orderId?: string
    clientId?: string
    status?: string
    orderDataText?: string
}

type UseClaimedOrdersResult = {
    orders: ClaimedOrderLite[]
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
    getPhoneOnDemand: (formId: string) => Promise<string | null>
}

const API_BASE = 'https://bot-crm-backend-756832582185.us-central1.run.app'

export function useClaimedOrders(pollMs: number = 5 * 60 * 1000): UseClaimedOrdersResult {
    const currentUser = useOrderStore(s => s.currentUser)
    const [orders, setOrders] = useState<ClaimedOrderLite[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const pollRef = useRef<NodeJS.Timeout | null>(null)

    const at = currentUser?.userAt

    const mapServerToLite = useCallback((form: any): ClaimedOrderLite => {
        // We NEVER keep phone in state here
        const formId = form?._id || form?.form_id || ''
        const orderId = form?.orderData?.order_id || form?.order_id || ''
        const createdAtRaw = form?.orderData?.date || form?.date || form?.createdAt || null
        const clientId = form?.orderData?.client_id || form?.client_id || ''
        const createdAt = createdAtRaw ? new Date(createdAtRaw) : null
        const text = form?.text || ''
        const orderDataText = form?.orderData?.text || ''
        const status = form?.status || 'claimed'
        
        // Extract client name from different sources
        let clientName = '—'
        
        // First try orderData.client_name (array)
        if (form?.orderData?.client_name && Array.isArray(form.orderData.client_name) && form.orderData.client_name.length > 0) {
            clientName = form.orderData.client_name[0]
        } else if (form?.orderData?.client_name && typeof form.orderData.client_name === 'string') {
            clientName = form.orderData.client_name
        } else if (form?.client_name) {
            clientName = form.client_name
        } else if (text) {
            // Parse from text: "👤 Имя: Omar Villalta"
            const nameMatch = text.match(/👤\s*Имя:\s*([^\n📍]+)/i) || text.match(/Имя:\s*([^\n📍]+)/i)
            if (nameMatch) {
                clientName = nameMatch[1].trim()
            }
        }
        
        // Extract client ID from text: "Клиент #c59904"
        if (text) {
            const clientIdMatch = text.match(/Клиент\s*#c?(\d+)/i)
            if (clientIdMatch) {
                clientId = clientIdMatch[1]
            }
        }
        
        // Extract location from text field
        let city = '', state = ''
        if (text) {
            // Try new format: "📍 Город: Bellflower 🏛 Штат: New York"
            const cityMatch = text.match(/📍\s*Город:\s*([^\n🏛]+)/i)
            const stateMatch = text.match(/🏛\s*Штат:\s*([^\n📞]+)/i)
            
            if (cityMatch) city = cityMatch[1].trim()
            if (stateMatch) state = stateMatch[1].trim()
            
            // Fallback to old format: "ip_location: United States, Massachusetts, Framingham"
            if (!city && !state) {
                const ipLocationMatch = text.match(/ip_location:\s*([^,\n]+),\s*([^,\n]+)/i)
                if (ipLocationMatch) {
                    state = ipLocationMatch[1]?.trim() || ''
                    city = ipLocationMatch[2]?.trim() || ''
                }
            }
        }
        
        return { _id: formId, formId, clientName, createdAt, city, state, text, orderId, clientId, status, orderDataText }
    }, [])

    const fetchOnce = useCallback(async () => {
        if (!at) return
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE}/api/current-available-claims/getClaimedOrders/${encodeURIComponent(at)}`)
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
            const ordersWithPhone: any[] = await res.json()
            const lite = ordersWithPhone.map(mapServerToLite)
            setOrders(lite)
        } catch (e: any) {
            setError(e?.message || 'Failed to load claimed orders')
        } finally {
            setLoading(false)
        }
    }, [at, mapServerToLite])

    const startPolling = useCallback(() => {
        if (pollRef.current) {
            clearInterval(pollRef.current)
            pollRef.current = null
        }
        if (!pollMs || pollMs <= 0) return
        pollRef.current = setInterval(() => {
            fetchOnce()
        }, pollMs)
    }, [fetchOnce, pollMs])

    useEffect(() => {
        if (!at) return
        fetchOnce()
        startPolling()
        const onVisibility = () => {
            if (document.visibilityState === 'visible') fetchOnce()
        }
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
            document.removeEventListener('visibilitychange', onVisibility)
            if (pollRef.current) clearInterval(pollRef.current)
        }
    }, [at, fetchOnce, startPolling])

    const getPhoneOnDemand = useCallback(async (formId: string): Promise<string | null> => {
        const at = currentUser?.userAt
        const team = currentUser?.team
        if (!at || !team) return null
        try {
          
            const res = await fetch(`${API_BASE}/api/current-available-claims/getPhone/${encodeURIComponent(formId)}/${encodeURIComponent(at)}/${encodeURIComponent(team)}`)
            if (!res.ok) return null
            const ordersWithPhone: any[] = await res.json()
            const match = ordersWithPhone.find((f: any) => (f?._id || f?.form_id) === formId)
            const phone = match?.phone || match?.orderData?.telephone || match?.telephone || null
            return typeof phone === 'string' ? phone : null
        } catch {
            return null
        }
    }, [currentUser?.userAt, currentUser?.team])

    const value = useMemo<UseClaimedOrdersResult>(() => ({
        orders,
        loading,
        error,
        refetch: fetchOnce,
        getPhoneOnDemand
    }), [orders, loading, error, fetchOnce, getPhoneOnDemand])

    return value
}


