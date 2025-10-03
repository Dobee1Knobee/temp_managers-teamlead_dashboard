'use client'
import { useOrderStore } from '@/stores/orderStore'
import { ClipboardClock } from 'lucide-react'
import React, { useState } from 'react'
import Header from "../form/components/Header"
import Sidebar from "../form/components/Sidebar"
import ModalSuccessWindow from './components/ModalSuccessWindow'
import RequestCard from "./components/RequestCard"

const requests = [
    { 
        id: '1', 
        name: 'Request 1', 
        type: 'site-form',
        createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 минут назад - срочная
        body: [
            '60" or larger $149 (1 tech and your help)',
            'I already have mount + $0',
            'Drywall, Plaster, Wood + $0',
            'Exposed + $0',
            'Skip'
        ] 
    },
    { 
        id: '2', 
        name: 'Request 2', 
        type: 'phone-call',
        createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 минут назад - срочная
    },
    { 
        id: '3', 
        name: 'Request 3', 
        type: 'site-form',
        createdAt: new Date(Date.now() - 10 * 60 * 1000) // 10 минут назад - не срочная
    },
    { 
        id: '4', 
        name: 'Request 4', 
        type: 'chat',
        createdAt: new Date(Date.now() - 40 * 60 * 1000) // 40 минут назад - срочная
    },
    { 
        id: '1', 
        name: 'Request 1', 
        type: 'site-form',
        createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 минут назад - срочная
        body: [
            '60" or larger $149 (1 tech and your help)',
            'I already have mount + $0',
            'Drywall, Plaster, Wood + $0',
            'Exposed + $0',
            'Skip'
        ] 
    },
    { 
        id: '4', 
        name: 'Request 4', 
        type: 'chat',
        createdAt: new Date(Date.now() - 40 * 60 * 1000) // 40 минут назад - срочная
    },
]
export default function ClaimRequestsPage() {
    // Состояние для модального окна
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [claimedRequestId, setClaimedRequestId] = useState<string | null>(null);
    
    // Получаем данные из стора и устанавливаем мок значение
    const unclaimedRequests = useOrderStore(state => state.unclaimedRequests);
    const setUnclaimedRequests = useOrderStore(state => state.setUnclaimedRequests);
    
    // Устанавливаем количество заявок в стор при загрузке компонента
    React.useEffect(() => {
        setUnclaimedRequests(requests.length);
    }, [setUnclaimedRequests]);

    // Функции для управления модальным окном
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setClaimedRequestId(null);
    };

    // Функция для обработки claim заявки
    const handleClaimRequest = (requestId: string) => {
        setClaimedRequestId(requestId);
        openModal();
    };

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 overflow-y-auto ml-7 mt-5">
                    {/* Модальное окно */}
                    <ModalSuccessWindow 
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        title="Заявка принята!"
                        message={`Вы успешно приняли заявку #${claimedRequestId} к работе`}
                        buttonText="Отлично!"
                    />
                
                    <div className="w-full h-12 flex flex-row items-center gap-2">
                        <ClipboardClock size={24} />
                        <h1 className="text-2xl font-bold">Claim Request</h1>
                        
                    </div>
                    
                    <div className="w-full pt-4 mx-auto ">
                        <div className="flex flex-wrap gap-4 ">
                            {requests.filter((request) => request.createdAt ).map((request) => (
                                <div key={request.id} className="flex-shrink">
                                    <RequestCard 
                                        request={request} 
                                        onClaim={handleClaimRequest}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}