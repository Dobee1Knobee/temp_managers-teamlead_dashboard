import { CheckCircle, X } from 'lucide-react'
import React, { useEffect } from 'react'

interface ModalSuccessWindowProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    message?: string
    id?: string
    requestText?: string
    buttonText?: string
    clientPhoneNumber?: string
}

export default function ModalSuccessWindow({
    isOpen,
    onClose,
    title = "Успешно!",
    message = "Операция выполнена успешно",
    id,
    requestText,
    clientPhoneNumber,
    buttonText = "Понятно"
}: ModalSuccessWindowProps) {
    // Закрытие по Escape клавише
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            // Блокируем скролл body когда модалка открыта
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    // Закрытие по клику на backdrop
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    // Не рендерим если закрыто
    if (!isOpen) return null

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in fade-in-0 zoom-in-95 duration-200">
                {/* Заголовок */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">    
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        aria-label="Закрыть"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Контент */}
                <div className="p-6">
                    <p className="text-gray-600 mb-6 text-center">{message}</p>
                    
                    {requestText && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-800 mb-3">Детали заявки:</h3>
                            <div className="bg-gray-50 rounded-lg p-3 max-h-60 overflow-y-auto">
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono" style={{ marginTop: '-1rem' }}>
                                    {requestText}
                                </pre>
                            </div>
                        </div>
                    )}
                    
                    {clientPhoneNumber && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-800 mb-3">Телефон клиента:</h3>
                            <div className="bg-gray-50 rounded-lg p-3 max-h-60 overflow-y-auto">
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono" style={{  }}>
                                    +1{clientPhoneNumber}
                                </pre>
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={onClose}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    )
}