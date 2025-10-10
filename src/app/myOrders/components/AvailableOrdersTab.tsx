import { useOrderStore } from '@/stores/orderStore'
import { useState } from 'react'
import ModalSuccessWindow from './ModalSuccessWindow'
import UnclaimedOrderCard from './UnclaimedOrderCard'

export default function AvailableOrdersTab() {
    const { unclaimedRequests, currentUser, loadUnclaimedRequests,claimRequest } = useOrderStore()
    const [claimedRequestId, setClaimedRequestId] = useState<string | null>(null);
    const [claimedClientPhoneNumber, setClaimedClientPhoneNumber] = useState<string>('');
    const [claimedRequestText, setClaimedRequestText] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setClaimedRequestId(null);
        setClaimedRequestText('');
        setClaimedClientPhoneNumber('');
    };
    const handleClaimOrder = async (requestId: string) => {
        try {
            // Находим заявку по ID и сохраняем её данные
            const request = unclaimedRequests.find(req => req._id === requestId);
            
            if (!request) {
                console.error('Request not found:', requestId);
                return;
            }

            // Выполняем claim
            const response = await claimRequest(requestId, currentUser?.team || '');
            
            if (response && response.message) {
                // Устанавливаем данные для модалки
                setClaimedRequestId(requestId);
                setClaimedRequestText(request.orderData.text);
                setClaimedClientPhoneNumber(response.phone || '');
                openModal();
                
                // Обновляем список заявок после успешного claim
                if (currentUser?.team) {
                    setTimeout(() => {
                        loadUnclaimedRequests(currentUser.team);
                    }, 1000);
                }
            } else {
                console.error('Claim failed:', response);
            }
        } catch (error) {
            console.error('Error claiming order:', error);
        }
    };

    if (!unclaimedRequests || unclaimedRequests.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">⏰</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                    No Available Orders
                </h3>
                <p className="text-gray-500">
                    There are no orders available for claiming at the moment.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {unclaimedRequests.map(order => (
                <UnclaimedOrderCard
                    key={order._id || order.orderData.order_id}
                    order={order}
                    onClaim={() => handleClaimOrder(order._id || order.orderData.order_id.toString())}
                />
            ))}
            <ModalSuccessWindow
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Заявка принята!"
                message={`Вы успешно приняли заявку #${claimedRequestId} к работе`}
                id={claimedRequestId}
                requestText={claimedRequestText}
                clientPhoneNumber={claimedClientPhoneNumber}
                buttonText="Отлично!"
            />
        </div>
    )
}
