'use client';

import { useOrderStore } from '@/stores/orderStore'
import { Eye, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ManagerOrdersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRefresh?: () => void;
    manager: {
        name: string;
        manager_id: string;
        at: string;
        orders: string[];
    } | null;
}

export default function ManagerOrdersModal({ isOpen, onClose, onRefresh, manager }: ManagerOrdersModalProps) {
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const updateOrder  = useOrderStore(state => state.getByLeadID);
    const setViewMode = useOrderStore(state => state.setViewMode);
    const router = useRouter();
    const handleUpdateOrder = async (leadId: string) => {
			const found = await updateOrder(leadId);
			if (found) {
				setViewMode(true); // Устанавливаем режим просмотра
				// Сохраняем команду текущего пользователя перед переходом
				const currentUser = useOrderStore.getState().currentUser;
				if (currentUser) {
					// Временно сохраняем команду пользователя в localStorage
					localStorage.setItem('viewModeUserTeam', currentUser.team);
				}
				router.push(`/changeOrder?leadId=${leadId}&viewMode=true`)
			}
	}
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleClose = () => {
        onClose();
        // Обновляем данные при закрытии модалки
        if (onRefresh) {
            onRefresh();
        }
    };

    const handleViewOrder = (orderId: string) => {
        setSelectedOrder(orderId);
        // Здесь можно добавить логику для открытия детальной информации о заказе
        console.log('Viewing order:', orderId);
    };

    if (!isOpen || !manager) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Manager Orders</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {manager.name} ({manager.manager_id})
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Press ESC to close
                        </p>
                        {selectedOrder && (
                            <p className="text-sm text-blue-600 mt-1 font-medium">
                                Selected: {selectedOrder}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Total orders: <span className="font-semibold">{manager.orders.length}</span>
                        </p>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {manager.orders.length > 0 ? (
                            manager.orders.map((orderId, index) => (
                                <div
                                    key={orderId}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                        selectedOrder === orderId 
                                            ? 'bg-blue-50 border-blue-200' 
                                            : 'bg-gray-50 border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-600">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{orderId}</p>
                                            <p className="text-sm text-gray-500">Order ID</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleUpdateOrder(orderId)}
                                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                    >
                                        <Eye size={16} />
                                        <span>View Details</span>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No orders assigned to this manager</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
