import { useClaimedOrders } from '@/hooks/useClaimedOrders'
import { useState } from 'react'
import ClaimedOrderCard from '../../claimed-request/components/ClaimedOrderCard'

export default function ClaimedOrdersTab() {
    const { orders: claimedOrders, loading, error, getPhoneOnDemand } = useClaimedOrders()
    const [phoneStates, setPhoneStates] = useState<Record<string, { phone?: string; loading: boolean }>>({})

    const handleShowPhone = async (formId: string) => {
        if (phoneStates[formId]?.phone) return // Already loaded
        
        setPhoneStates(prev => ({ ...prev, [formId]: { loading: true } }))
        
        try {
            const phone = await getPhoneOnDemand(formId)
            setPhoneStates(prev => ({ 
                ...prev, 
                [formId]: { phone: phone || undefined, loading: false } 
            }))
        } catch {
            setPhoneStates(prev => ({ 
                ...prev, 
                [formId]: { loading: false } 
            }))
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Loading claimed orders...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                    <span className="text-red-600">⚠</span>
                    <span className="text-red-800 font-medium">Error:</span>
                    <span className="text-red-700">{error}</span>
                </div>
            </div>
        )
    }

    if (claimedOrders.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">✅</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                    No Claimed Orders
                </h3>
                <p className="text-gray-500">
                    You haven't claimed any orders yet.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {claimedOrders.map(order => (
                <ClaimedOrderCard
                    key={order.formId}
                    order={order}
                    phone={phoneStates[order.formId]?.phone}
                    onShowPhone={() => handleShowPhone(order.formId)}
                    isLoadingPhone={phoneStates[order.formId]?.loading || false}
                />
            ))}
        </div>
    )
}
