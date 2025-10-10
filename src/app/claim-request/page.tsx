'use client'
import { useOrderStore } from '@/stores/orderStore'
import { ClipboardClock } from 'lucide-react'
import { useEffect, useState } from 'react'
import Header from "../form/components/Header"
import Sidebar from "../form/components/Sidebar"
import ModalSuccessWindow from '../myOrders/components/ModalSuccessWindow'
import RequestCard from "./components/RequestCard"

export default function ClaimRequestsPage() {
    // Состояние для модального окна
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [claimedClientPhoneNumber, setClaimedClientPhoneNumber] = useState<string>('');
    const [claimedRequestText, setClaimedRequestText] = useState<string>('');
    
    // Получаем данные из стора
    const unclaimedRequests = useOrderStore(state => state.unclaimedRequests);
    const loadUnclaimedRequests = useOrderStore(state => state.loadUnclaimedRequests);
    const currentUser = useOrderStore(state => state.currentUser);
    
    // Загружаем незаклейменные заявки при инициализации страницы
    useEffect(() => {
        if (currentUser?.team) {
            loadUnclaimedRequests(currentUser.team);
        }
    }, [currentUser?.team, loadUnclaimedRequests]);

    // Функции для управления модальным окном
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setClaimedRequestText('');
        setClaimedClientPhoneNumber('');
    };

    // Функция для обработки claim заявки
    const handleClaimRequest = (requestId: string) => {
        // Находим заявку по ID и сохраняем её данные
        const request = unclaimedRequests.find(req => req.orderData.order_id.toString() === requestId);
        if (request) {
            setClaimedRequestText(request.orderData.text);
            setClaimedClientPhoneNumber(request.orderData.phoneNumber);
            openModal();
        }
        
        // После claim можно обновить список заявок
        if (currentUser?.team) {
            setTimeout(() => {
                loadUnclaimedRequests(currentUser.team);
            }, 1000);
        }
    };

    // Преобразуем данные из store в формат для RequestCard
    const transformedRequests = unclaimedRequests.map((request, index) => ({
        id: request.orderData.order_id.toString(),
        type: 'site-form', // Можно определить тип на основе данных
        name: request.orderData.clientName,
        createdAt: new Date(request.orderData.date)
    }));

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
                        message={`Вы успешно приняли заявку #$ к работе`}
                        requestText={claimedRequestText}
                        buttonText="Отлично!"
                    />
                
                    <div className="w-full h-12 flex flex-row items-center gap-2">
                        <ClipboardClock size={24} />
                        <h1 className="text-2xl font-bold">Claim Request</h1>
                        
                    </div>
                    
                    <div className="w-full pt-4 mx-auto ">
                        {transformedRequests.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-lg">Нет доступных заявок для claim</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-4 ">
                                {transformedRequests.map((request) => (
                                    <div key={request.id} className="flex-shrink">
                                        <RequestCard 
                                            request={request} 
                                            onClaim={handleClaimRequest}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}