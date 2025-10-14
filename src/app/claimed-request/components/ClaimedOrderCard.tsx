"use client"

import { getPhoneNumber } from '@/hooks/useGetPhoneNumber'
import { useOrderStore } from '@/stores/orderStore'
import { Calendar, Eye, Loader2, MapPin, Repeat } from 'lucide-react'
import { useEffect, useState } from 'react'
import NotValidModal from './NotValidModal'

interface ClaimedOrderCardProps {
    order: {
        formId: string
        clientName: string
        createdAt: Date | null
        city?: string
        state?: string
        text?: string
        orderId?: string
        clientId?: string
        status?: string
        orderDataText?: string
    }
    phone?: string
    onShowPhone: () => void
    isLoadingPhone?: boolean
}

export default function ClaimedOrderCard({ order, onShowPhone }: ClaimedOrderCardProps) {
    const [showDetails, setShowDetails] = useState(false)
    const [showContactInfo, setShowContactInfo] = useState(false)
    const [showNotValidModal,setShowNotValidModal] = useState(false)
    const [phone,setPhone] = useState("")
    const [isLoadingPhone, setIsLoadingPhone] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const currentUser = useOrderStore(s => s.currentUser)
    const processOrderWithParsing = useOrderStore(s => s.processOrderWithParsing)
    const at = currentUser?.userAt
    const team = currentUser?.team
    const { formId, clientName, createdAt, city, state, text, orderId, clientId, status, orderDataText } = order
    useEffect(() => {
        if (showDetails) {
            setShowContactInfo(false)
        }
    }, [showDetails])
    const handleNotValidOrder = () => {
        setShowContactInfo(false)
    }
    // Обработчик для кнопки "Process the request"
    const handleProcessRequest = async () => {
        if (!orderDataText) {
            console.warn('Нет текста заявки для обработки');
            return;
        }

        setIsProcessing(true);
        try {
            await processOrderWithParsing(
                orderDataText,
                clientName,
                formId,
                phone || undefined
            );
        } catch (error) {
            console.error('Ошибка при обработке заявки:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Обработчик для модалки невалидного заказа
    const handleMarkAsInvalid = async (reason: string) => {
        try {
            // Здесь можно добавить логику отправки на сервер
            console.log('Marking order as invalid:', {
                orderId: formId,
                clientName,
                reason,
                phone: phone || undefined
            });
            
            // Показываем уведомление
            
        } catch (error) {
            console.error('Error marking order as invalid:', error);
            throw error;
        }
    };
    useEffect(() => {
        setIsLoadingPhone(true)
        const fetchPhone = async () => {
            if (showContactInfo && at && team) {
                try {
                    const phoneNumber = await getPhoneNumber(at, team, formId)
                    if(phoneNumber) {
                        setPhone(phoneNumber)
                    }
                } catch (error) {
                    console.error('Error fetching phone:', error)
                } finally {
                    setIsLoadingPhone(false)
                }
            }
        }
        
        fetchPhone()
    }, [showContactInfo, at, team, formId])
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && showDetails) {
                setShowDetails(false)
            }
        }
        
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [showDetails])
    // Format date
    const formatDate = (date: Date | null) => {
        if (!date) return '—'
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }
    
    // Get short ID for display
    const shortId = formId.slice(-6)
    const displayOrderId = orderId || shortId
    
    // Extract key info from text
    const extractTextInfo = (text: string) => {
        if (!text) return { type: '', answers: '', leadId: '' }
        
        // Extract type: "Type: TV"
        const typeMatch = text.match(/Type:\s*([^\n]+)/i)
        const type = typeMatch ? typeMatch[1].trim() : ''
        
        // Extract answers section
        const answersMatch = text.match(/📝\s*Ответы на вопросы:\s*([^🆔]+)/s)
        const answers = answersMatch ? answersMatch[1].trim() : ''
        
        // Extract lead ID: "🆔 ID заявки: 3453463456"
        const leadIdMatch = text.match(/🆔\s*ID заявки:\s*([^\n]+)/i)
        const leadId = leadIdMatch ? leadIdMatch[1].trim() : ''
        
        return { type, answers, leadId }
    }
    
    const { type, answers, leadId } = extractTextInfo(text || '')
    
    // Get status color and text
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'taken':
                return { color: 'bg-green-500', text: 'Claimed', bgColor: 'bg-green-100', textColor: 'text-green-800' }
            case 'pending':
                return { color: 'bg-yellow-500', text: 'Ожидает занесения', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' }
            default:
                return { color: 'bg-gray-500', text: 'Неизвестно', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
        }
    }
    
    const statusInfo = getStatusInfo(status || 'taken')
    
    return (
        <>
            <div className="h-full w-full bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-200 flex flex-col overflow-hidden">
            {/* Заголовок с полоской статуса */}
            <div className="relative">
                <div className={`absolute top-0 left-0 w-1 h-full ${statusInfo.color} rounded-l-xl`}></div>
                <div className="p-4 pl-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {clientName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-base font-bold text-gray-900 truncate">{clientName}</h2>
                                <p className="text-sm text-gray-500 truncate">{statusInfo.text}</p>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                                #{displayOrderId}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Основной контент */}
            <div className="px-4 pb-4 flex-1">
                <div className="space-y-3">
                    {/* Тип заказа */}
                    {type && (
                        <div className="flex justify-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                {type}
                            </span>
                        </div>
                    )}
                    
                    {/* Локация */}
                    {(city || state) && (
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                            <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">
                                {state && city ? `${state}, ${city}` : state || city}
                            </span>
                        </div>
                    )}
                    
                    {/* Дата и ID клиента */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{formatDate(createdAt)}</span>
                        </div>
                        
                        {clientId && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">ID: {clientId}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Действия */}
            <div className="px-4 pb-4 space-y-3">
           
                {/* Кнопка деталей */}
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 text-gray-600 hover:text-gray-800 text-sm flex items-center justify-center gap-2 transition-colors py-2 hover:bg-gray-50 "
                >
                    <Eye size={16} />
                    {showDetails ? 'Hide details' : 'Show details'}
                </button>
                
                {/* Кнопка обработки */}
                <button 
                    onClick={handleProcessRequest}
                    disabled={isProcessing || !orderDataText}
                    className={`w-full border rounded-lg p-3 text-sm flex items-center justify-center gap-2 transition-colors py-2 ${
                        isProcessing || !orderDataText
                            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-green-50 border-green-200 text-gray-600 hover:text-gray-800 hover:bg-green-100'
                    }`}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Repeat size={16} />
                            Process the request
                        </>
                    )}
                </button>

            </div>
        </div>
            
            {/* Красивая модалка для деталей */}
            {showDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        {/* Заголовок модалки */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                                    {clientName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{clientName}</h2>
                                    <p className="text-sm text-gray-500">{statusInfo.text}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Контент модалки */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                            <div className="space-y-6">
                                {/* Основная информация */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-sm font-medium text-gray-500 mb-1">ID заказа</div>
                                        <div className="text-lg font-mono text-gray-900">{formId}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-sm font-medium text-gray-500 mb-1">Статус</div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                                            {statusInfo.text}
                                        </span>
                                    </div>
                                </div>
                                
                                
                                {/* Локация и дата */}
                                <div className="grid grid-cols-2 gap-6">
                                <div className="grid  gap-6">
                                    {(city || state) && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="text-sm font-medium text-gray-500 mb-1">Локация</div>
                                            <div className="text-lg text-gray-900">
                                                {state && city ? `${state}, ${city}` : state || city}
                                            </div>
                                        </div>
                                    )}
                                   <div>
                                    <div className="relative flex items-center justify-center">
                                        {!showContactInfo && (<button className="absolute  left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 px-3 py-1.5 
                                        mt-28 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50" onClick={() => setShowContactInfo(true)}>Show contact info </button>)}
                                    </div>
                                    {!showContactInfo && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 blur-sm z-0 relative">
                                        <div className="text-sm font-medium text-gray-500 mb-1">Contact info</div>
                                        <div className="text-lg text-gray-900">1234567890 {isLoadingPhone && <Loader2 className="w-4 h-4 animate-spin inline ml-2" />}</div>
                                    </div>
                                    )}
                                   {showContactInfo && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4  z-0 relative">
                                    <div className="text-sm font-medium text-gray-500 mb-1">Contact info</div>
                                    <div className="text-lg text-gray-900">
                                        {isLoadingPhone ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Loading...</span>
                                            </div>
                                        ) : (
                                            phone || 'No phone available'
                                        )}
                                    </div>
                                </div>
                                   )}
                                   </div>
                                </div>
                                    {(city || state) && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="text-sm font-medium text-gray-500 mb-1">Локация</div>
                                            <div className="text-lg text-gray-900">
                                                {state && city ? `${state}, ${city}` : state || city}
                                            </div>
                                        </div>
                                    )}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-sm font-medium text-gray-500 mb-1">Дата создания</div>
                                        <div className="text-lg text-gray-900">{formatDate(createdAt)}</div>
                                    </div>
                                </div>
                                
                                {/* Тип заказа */}
                                {type && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="text-sm font-medium text-blue-600 mb-1">Тип заказа</div>
                                        <div className="text-lg font-semibold text-blue-900">{type}</div>
                                    </div>
                                )}
                                
                                {/* Ответы на вопросы */}
                                {answers && (
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900 mb-3">Ответы на вопросы</div>
                                        <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap border max-h-64 overflow-y-auto">
                                            {answers}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Данные заказа */}
                                {orderDataText && (
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900 mb-3">Данные заказа</div>
                                        <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap border max-h-64 overflow-y-auto">
                                            {orderDataText}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Футер модалки */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-end  ">
                                <button
                                    onClick={() => {
                                        setShowDetails(false);
                                        setShowNotValidModal(true);
                                    }}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    Not valid
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Модалка для невалидного заказа */}
            <NotValidModal
                isOpen={showNotValidModal}
                onClose={() => setShowNotValidModal(false)}
                onConfirm={handleMarkAsInvalid}
                orderInfo={{
                    clientName,
                    orderId: formId,
                    phoneNumber: displayOrderId || undefined
                }}
            />
        </>
    )
}
