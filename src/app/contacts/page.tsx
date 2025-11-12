"use client"

import ProtectedRoute from '@/components/ProtectedRoute'
import { MoveLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import Header from '../form/components/Header'
import Sidebar from '../form/components/Sidebar'
export default function ContactsPage() {

	const [isPhoneNumbers, setIsPhoneNumbers] = useState(false);
	const [isRecords, setIsRecords] = useState(false);

	const handleGetPhoneNumbers = () => {
		setIsPhoneNumbers(true);
		setIsRecords(false);
	}

	const handleGetRecords = () => {
		setIsRecords(true);
		setIsPhoneNumbers(false);
	}
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			setIsPhoneNumbers(false);	
			setIsRecords(false);
		}
		};
		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isPhoneNumbers, isRecords]);
	return (
        <ProtectedRoute>
            <div className="h-screen flex bg-gray-50 overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 text-2xl font-bold">
                            <h1>Get phone numbers or records by #call_id</h1>
                        </div>
                        {!isPhoneNumbers && !isRecords && (
                            <div className="mx-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex w-full justify-center gap-2">
                                        <button 
                                            onClick={handleGetPhoneNumbers}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            Get phone numbers
                                        </button>
                                        <button 
                                            onClick={handleGetRecords}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            Get records
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isPhoneNumbers && (
                            <div className="mx-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setIsPhoneNumbers(false)}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <MoveLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="flex w-full gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Enter #call_id" 
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300" 
                                        />
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200">
                                            Get phone numbers
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isRecords && (
                            <div className="mx-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setIsRecords(false)}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <MoveLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="flex w-full gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Enter #call_id" 
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300" 
                                        />
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200">
                                            Get records
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}