'use client'
import { ClipboardClock } from 'lucide-react'
import Header from "../form/components/Header"
import Sidebar from "../form/components/Sidebar"
import RequestCard from "./components/RequestCard"

export default function ClaimRequestsPage() {
    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 overflow-y-auto ml-7 mt-5">
                    <div className="w-full h-12 flex flex-row items-center gap-2">
                        <ClipboardClock size={24} />
                        <h1 className="text-2xl font-bold">Claim Request</h1>
                    </div>
                    
                    <div className="w-full h-12 mt-20 flex flex-row items-center gap-2">
                        <RequestCard request={{ id: '1', name: 'Request 1', type: 'site-form' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}