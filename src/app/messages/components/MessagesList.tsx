"use client"
import { useOrderStore } from "@/stores/orderStore"
import { Bell, BellOff, Filter, Trash2 } from "lucide-react"
import { useState } from "react"
import MessageCard from "./MessageCard"

export default function MessagesList() {
    const { notifications, clearNotifications, getUnreadNotificationsCount } = useOrderStore()
    const [filter, setFilter] = useState<'all' | 'unread'>('all')
    
    const unreadCount = getUnreadNotificationsCount()
    
    // Фильтрация уведомлений
    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') {
            return !notification.read
        }
        return true
    })

    const handleClearAll = () => {
        if (confirm('Вы уверены, что хотите удалить все уведомления?')) {
            clearNotifications()
        }
    }

    return (
        <div className="space-y-6">
            {/* Заголовок и статистика */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Сообщения</h1>
                    <p className="text-gray-600 mt-1">
                        {notifications.length} {notifications.length === 1 ? 'сообщение' : 
                         notifications.length < 5 ? 'сообщения' : 'сообщений'}
                        {unreadCount > 0 && (
                            <span className="ml-2 text-blue-600 font-medium">
                                ({unreadCount} непрочитанных)
                            </span>
                        )}
                    </p>
                </div>
                
                {notifications.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Очистить все</span>
                    </button>
                )}
            </div>

            {/* Фильтры */}
            {notifications.length > 0 && (
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Фильтр:</span>
                    </div>
                    
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                filter === 'all' 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Все ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                filter === 'unread' 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Непрочитанные ({unreadCount})
                        </button>
                    </div>
                </div>
            )}

            {/* Список уведомлений */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                        {notifications.length === 0 ? (
                            <>
                                <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Нет сообщений
                                </h3>
                                <p className="text-gray-600">
                                    Когда появятся новые уведомления, они отобразятся здесь
                                </p>
                            </>
                        ) : (
                            <>
                                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Нет непрочитанных сообщений
                                </h3>
                                <p className="text-gray-600">
                                    Все сообщения прочитаны
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <MessageCard 
                            key={notification.id} 
                            notification={notification} 
                        />
                    ))
                )}
            </div>
        </div>
    )
}
