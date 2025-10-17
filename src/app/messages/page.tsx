"use client"
import Header from '@/app/form/components/Header'
import Sidebar from '@/app/form/components/Sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import MessagesList from './components/MessagesList'

export default function Messages() {
    return (
        <ProtectedRoute>
            <div className="h-screen flex bg-gray-50 overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            <MessagesList />
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}