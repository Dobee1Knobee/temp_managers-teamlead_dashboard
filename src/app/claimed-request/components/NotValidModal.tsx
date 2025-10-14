"use client"

import { useOrderStore } from '@/stores/orderStore'
import { AlertTriangle, Send, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface NotValidModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
    orderInfo?: {
        clientName: string
        orderId: string
        phoneNumber?: string
    }
}

export default function NotValidModal({ isOpen, onClose, onConfirm, orderInfo }: NotValidModalProps) {
    const [reason, setReason] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const currentUser = useOrderStore(s => s.currentUser)
    const at = currentUser?.userAt
    const team = currentUser?.team

		const handleInvalidOrder = async (formId: string, at: string, reason: string) => {
			try {
				const res = await fetch(`https://bot-crm-backend-756832582185.us-central1.run.app/api/current-available-claims/invalidClaim`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ 
						claim_Object_Id: formId,
						at: at,
						reason: reason
					})
				});

				const data = await res.json();
				
				if (res.ok) {
					console.log('✅ Order marked as invalid successfully:', data);
					return data;
				} else {
					console.error('❌ Error from server:', data);
					throw new Error(data.error || 'Failed to mark order as invalid');
				}
			} catch (error) {
				console.error('❌ Error invalidating order:', error);
				throw error;
			}
		}


    const handleSubmit = async () => {
        if (!reason.trim()) {
            return
        }

        if (!at || !orderInfo) {
            console.error('Missing required data: at or orderInfo');
            return;
        }

        setIsSubmitting(true)
        try {
            const result = await handleInvalidOrder(orderInfo.orderId, at, reason.trim())
            
            // Показываем успешное уведомление

						toast.success(`Order marked as invalid successfully!\nLead ID: ${result.leadId}\nStatus: ${result.status}`)
            
            // Вызываем callback если есть
            if (onConfirm) {
                await onConfirm(reason.trim())
            }
            
            setReason('')
            onClose()
        } catch (error) {
            console.error('Error submitting invalid order:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to mark order as invalid'
            alert(`Error: ${errorMessage}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setReason('')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Mark as Invalid</h2>
                            <p className="text-sm text-gray-500">Explain why this order is not valid</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Order Info */}
                    {orderInfo && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div><span className="font-medium">Client:</span> {orderInfo.clientName}</div>
                                <div><span className="font-medium">Order ID:</span> {orderInfo.orderId}</div>
                                {orderInfo.phoneNumber && (
                                    <div><span className="font-medium">Client ID:</span> #c{orderInfo.phoneNumber}
																		</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Reason Input */}
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 ">
                            Reason for marking as invalid *
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why this order is not valid (e.g., fake information, wrong location, already completed, etc.)"
                            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                            maxLength={500}
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                            {reason.length}/500 characters
                        </div>
                    </div>

                    {/* Common Reasons */}
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 ">
                            Quick reasons (click to select):
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {[
                                'Fake or test information',
                                'Wrong location/address',
                                'Already completed by another team',
                                'Customer cancelled',
                                'Invalid phone number',
                                'Duplicate order',
                                'Incomplete information'
                            ].map((quickReason) => (
                                <button
                                    key={quickReason}
                                    onClick={() => setReason(quickReason)}
                                    className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                                >
                                    {quickReason}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3  border-t border-gray-200 bg-gray-50 flex-shrink-0 p-2 " >
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!reason.trim() || isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Mark as Invalid
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}