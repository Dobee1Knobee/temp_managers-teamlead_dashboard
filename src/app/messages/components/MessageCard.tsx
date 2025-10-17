"use client"
import { useOrderStore } from "@/stores/orderStore"
import { Bell, Check, X } from "lucide-react"

// Функция для форматирования времени
const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
        return 'только что'
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
        return `${diffInMinutes} мин назад`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
        return `${diffInHours} ч назад`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
        return `${diffInDays} дн назад`
    }
    
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

interface MessageCardProps {
    notification: {
        id: number
        type: string
        form_id?: string
        title: string
        message: string
        order_id?: string
        transferred_from?: string
        timestamp: Date
        read: boolean
    }
}

export default function MessageCard({ notification }: MessageCardProps) {
    const { markNotificationAsRead } = useOrderStore()

    const handleMarkAsRead = () => {
        if (!notification.read) {
            markNotificationAsRead(notification.id)
        }
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'target-notification':
                return <Bell className="w-5 h-5 text-blue-600" />
            case 'order-claimed':
                return <Check className="w-5 h-5 text-green-600" />
            case 'order-transferred':
                return <X className="w-5 h-5 text-orange-600" />
            default:
                return <Bell className="w-5 h-5 text-gray-600" />
        }
    }

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'target-notification':
                return 'border-l-blue-500 bg-blue-50'
            case 'order-claimed':
                return 'border-l-green-500 bg-green-50'
            case 'order-transferred':
                return 'border-l-orange-500 bg-orange-50'
            default:
                return 'border-l-gray-500 bg-gray-50'
        }
    }

    return (
        <div 
            className={`
                relative p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
                ${getNotificationColor(notification.type)}
                ${!notification.read ? 'ring-2 ring-blue-200' : ''}
            `}
            onClick={handleMarkAsRead}
        >
            {/* Индикатор непрочитанного */}
            {!notification.read && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
            )}

            <div className="flex items-start space-x-3">
                {/* Иконка */}
                <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                </div>

                {/* Содержимое */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                            {formatTimeAgo(new Date(notification.timestamp))}
                        </span>
                    </div>
                    
                    <p className={`mt-1 text-sm ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                        {notification.message}
                    </p>

                    {/* Дополнительная информация */}
                    {(notification.form_id || notification.order_id || notification.transferred_from) && (
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                            {notification.form_id && (
                                <span className="bg-white px-2 py-1 rounded border">
                                    ID: {notification.form_id}
                                </span>
                            )}
                            {notification.order_id && (
                                <span className="bg-white px-2 py-1 rounded border">
                                    Заказ: {notification.order_id}
                                </span>
                            )}
                            {notification.transferred_from && (
                                <span className="bg-white px-2 py-1 rounded border">
                                    От: {notification.transferred_from}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
