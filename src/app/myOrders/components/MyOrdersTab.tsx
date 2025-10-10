import { OrderStatus } from '@/types/api'
import OrderCard from './OrderCard'

interface MyOrdersTabProps {
    displayOrders: any[]
    changeStatus: (status: OrderStatus, orderId: string) => void
    isSearchMode: boolean
}

export default function MyOrdersTab({ displayOrders, changeStatus, isSearchMode }: MyOrdersTabProps) {
    if (displayOrders.length > 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayOrders.map(order => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        onChangeStatus={(id, st) => changeStatus(st, order.order_id)}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
                {isSearchMode ? 'No your orders found' : 'No orders found'}
            </h3>
            <p className="text-gray-500">
                {isSearchMode
                    ? 'No orders belonging to you match the search criteria. Try different keywords.'
                    : 'There are no orders matching your criteria.'
                }
            </p>
        </div>
    )
}
