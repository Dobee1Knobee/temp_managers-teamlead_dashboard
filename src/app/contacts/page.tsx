"use client"

import ProtectedRoute from '@/components/ProtectedRoute'
import { useOrderStore } from '@/stores/orderStore'
import { MoveLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import Header from '../form/components/Header'
import Sidebar from '../form/components/Sidebar'
export default function ContactsPage() {
	const [isPhoneNumbers, setIsPhoneNumbers] = useState(false);
	const [isRecords, setIsRecords] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [resultsType, setResultsType] = useState<'phone' | 'records' | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const { getPhoneNumbers, getRecords } = useOrderStore();
    const [clientId, setClientId] = useState('');
    
    const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/^#+/, ''); // Удаляем # в начале, если пользователь его ввел
        setClientId(value);
    };

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
    const handleGetPhoneNumbers = () => {
        console.log('Calling getPhoneNumbers with clientId:', clientId);
        getPhoneNumbers(clientId)
            .then((data: any) => {
                console.log('getPhoneNumbers response:', data);

                let resultsArray: string[] = [];
                if (Array.isArray(data)) {
                    // Если массив объектов, извлекаем поле phone из каждого
                    resultsArray = data.map(item => {
                        if (typeof item === 'string') return item;
                        if (item && typeof item === 'object' && item.phone) return item.phone;
                        return JSON.stringify(item);
                    });
                } else if (data && typeof data === 'object') {
                    // Если один объект, извлекаем поле phone
                    if (data.phone) {
                        resultsArray = [data.phone];
                    } else if (data.phones && Array.isArray(data.phones)) {
                        resultsArray = data.phones.map((item: any) => 
                            typeof item === 'string' ? item : (item?.phone || JSON.stringify(item))
                        );
                    } else if (data.data) {
                        const phones = Array.isArray(data.data) ? data.data : [data.data];
                        resultsArray = phones.map((item: any) => 
                            typeof item === 'string' ? item : (item?.phone || JSON.stringify(item))
                        );
                    } else {
                        resultsArray = [JSON.stringify(data)];
                    }
                } else if (data) {
                    resultsArray = [typeof data === 'string' ? data : JSON.stringify(data)];
                }
                setResults(resultsArray);
                setResultsType('phone');
            })
            .catch((error) => {
                console.error('Error getting phone numbers:', error);
                setResults([]);
            });
        setIsSearching(false);
        setIsPhoneNumbers(false);
        setClientId('');
    }
    const handleGetRecords = () => {
        console.log('Calling getRecords with clientId:', clientId);
        getRecords(clientId)
            .then((data: any) => {
                console.log('getRecords response:', data);
                // Проверяем формат ответа - может быть массив или объект
                let resultsArray: string[] = [];
                if (Array.isArray(data)) {
                    resultsArray = data.map(item => typeof item === 'string' ? item : JSON.stringify(item));
                } else if (data && typeof data === 'object') {
                    const records = (data as any).records || (data as any).data || data;
                    resultsArray = Array.isArray(records) 
                        ? records.map((item: any) => typeof item === 'string' ? item : JSON.stringify(item))
                        : [typeof records === 'string' ? records : JSON.stringify(records)];
                } else if (data) {
                    resultsArray = [typeof data === 'string' ? data : JSON.stringify(data)];
                }
                setResults(resultsArray);
                setResultsType('records');
            })
            .catch((error) => {
                console.error('Error getting records:', error);
                setResults([]);
            });
        setIsSearching(false);
        setIsRecords(false);
        setClientId('')
    }
	return (
        <ProtectedRoute>
            <div className="h-screen flex bg-gray-50 overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 text-2xl font-bold">
                            <h1>Get phone numbers or records by #client_id</h1>
                        </div>
                        {!isSearching && (
                            <div className="mx-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex w-full justify-center gap-2">
                                        <button 
                                            onClick={() => {setIsSearching(true); setIsPhoneNumbers(true)}}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200 font-medium"
                                        >
                                            Get phone numbers
                                        </button>
                                        <button
                                            onClick={() => {
                                                // TODO: Добавить функционал генерации client_id
                                                console.log('Generate client_id clicked');
                                            }}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors duration-200 font-medium"
                                        >
                                            Generate client_id
                                        </button>
                                        <button 
                                            onClick={() => {setIsSearching(true); setIsRecords(true);}}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200 font-medium"
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
                                        onClick={() => {
                                            setIsSearching(false); 
                                            setIsPhoneNumbers(false);
                                            setResults([]);
                                            setResultsType(null);
                                        }}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <MoveLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="flex w-full gap-2">
                                        <div className="flex-1 relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">#</span>
                                            <input 
                                                type="text" 
                                                placeholder="client_id" 
                                                className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300" 
                                                value={clientId}
                                                onChange={handleClientIdChange}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleGetPhoneNumbers}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            Get phone numbers
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isRecords && isSearching && (
                            <div className="mx-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => {
                                            setIsRecords(false);
                                            setIsSearching(false);
                                            setResults([]);
                                            setResultsType(null);
                                        }}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <MoveLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="flex w-full gap-2">
                                        <div className="flex-1 relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">#</span>
                                            <input 
                                                type="text" 
                                                placeholder="client_id" 
                                                className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                                                value={clientId}
                                                onChange={handleClientIdChange}
                                            />
                                        </div>
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
                        {results.length > 0 && resultsType && (
                            <div className="mx-6 mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-xl font-semibold mb-4">
                                    {resultsType === 'phone' ? 'Phone Numbers' : 'Records'}
                                </h2>
                                <div className="space-y-2">
                                    {results.map((result, index) => (
                                        <div 
                                            key={index}
                                            className="p-3 bg-gray-50 rounded-lg border border-gray-200 break-words"
                                        >
                                            {result}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}