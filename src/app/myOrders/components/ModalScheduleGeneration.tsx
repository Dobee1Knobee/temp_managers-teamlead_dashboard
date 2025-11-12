import { Order } from "@/types/formDataType"
import { CalendarCheck, Copy, Package, X } from "lucide-react"
import React, { useMemo, useState } from 'react'
import toast from "react-hot-toast"

export type ModalScheduleGenerationProps = {
    isOpen: boolean
    onClose: () => void
    order: Order
}

// Функция для группировки одинаковых допов и материалов
function groupItems<T extends { label: string; count: number }>(items: T[]): Array<T & { totalCount: number }> {
    const grouped = new Map<string, T & { totalCount: number }>()
    
    items.forEach(item => {
        const key = item.label
        if (grouped.has(key)) {
            const existing = grouped.get(key)!
            existing.totalCount += item.count
        } else {
            grouped.set(key, { ...item, totalCount: item.count })
        }
    })
    
    return Array.from(grouped.values())
}

// Функция для парсинга даты из различных форматов
function parseDate(dateStr?: string): Date | null {
    if (!dateStr) return null
    
    // Если дата содержит am/pm, извлекаем только дату
    if (/am|pm/i.test(dateStr)) {
        const dateMatch = dateStr.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
            dateStr = dateMatch[1];
        }
    }
    
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        return date;
    } catch {
        return null;
    }
}

// Функция для форматирования даты в формат "20 Nov."
function formatDate(dateStr?: string): string {
    const date = parseDate(dateStr);
    if (!date) return ''
    
    const day = date.getDate();
    const monthNames = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
    const month = monthNames[date.getMonth()];
    
    return `${day} ${month}`;
}

// Функция для форматирования времени в формат "6pm"
function formatTime(timeStr?: string, dateStr?: string): string {
    if (!timeStr && !dateStr) return ''
    
    // Если время указано отдельно и содержит am/pm
    if (timeStr && /am|pm/i.test(timeStr)) {
        const timeMatch = timeStr.match(/(\d+)\s*(am|pm)/i);
        if (timeMatch) {
            return `${timeMatch[1]}${timeMatch[2].toLowerCase()}`;
        }
        return timeStr.toLowerCase().replace(/\s+/g, '');
    }
    
    // Если дата содержит время с am/pm
    if (dateStr && /am|pm/i.test(dateStr)) {
        const timeMatch = dateStr.match(/(\d+)\s*(am|pm)/i);
        if (timeMatch) {
            return `${timeMatch[1]}${timeMatch[2].toLowerCase()}`;
        }
    }
    
    return timeStr || '';
}

// Функция для генерации текста для копирования
function generateScheduleText(order: Order): string {
    // Дата и время
    const datePart = formatDate(order.date);
    const timePart = formatTime(order.time, order.date);
    const dateTime = datePart && timePart ? `${datePart} - ${timePart}` : datePart || timePart || '';
    
    // Количество техников
    const techCount = order.additionalTechName ? 2 : 1;
    const techsLine = `${techCount} techs`;
    
    // Код команды (TVMM - возможно TV + команда, или просто команда)
    const teamCode = order.team ? `TV${order.team}` : 'TVMM';
    
    // ID заказа
    const orderId = order.order_id || '';
    
    // Диагонали и допы
    const diagonalsSet = new Set<string>();
    const allAddons = order.services?.flatMap(service => service.addons || []) || [];
    
    order.services?.forEach(service => {
        if (service.diagonal) {
            // Разбиваем диагональ по запятой и добавляем каждую
            const diagonalParts = service.diagonal.split(',').map(d => d.trim()).filter(Boolean);
            diagonalParts.forEach(d => diagonalsSet.add(d));
        }
    });
    
    // Группируем допы с количеством
    const groupedAddons = groupItems(allAddons);
    const addonsStr = groupedAddons.map(addon => 
        addon.totalCount > 1 ? `${addon.label} x${addon.totalCount}` : addon.label
    ).join(' + ');
    
    const diagonalsStr = Array.from(diagonalsSet).map(d => `${d} inch`).join(', ');
    const servicesLine = [diagonalsStr, addonsStr].filter(Boolean).join(' + ') || '';
    
    // Цена
    const price = order.custom || order.total || 0;
    const priceLine = `${price} $`;
    
    // Client ID
    const clientId = order.client_id ? `#c${order.client_id}` : '';
    
    // Собираем все строки
    const lines = [
        dateTime,
        techsLine,
        teamCode,
        orderId,
        servicesLine,
        priceLine,
        clientId
    ].filter(Boolean);
    
    return lines.join('\n\n');
}

export default function ModalScheduleGeneration({ isOpen, onClose, order }: ModalScheduleGenerationProps) {
    const [copied, setCopied] = useState(false)
    
    // Группируем все допы и материалы из всех услуг
    const allAddons = order.services?.flatMap(service => service.addons || []) || []
    const allMaterials = order.services?.flatMap(service => service.materials || []) || []
    
    const groupedAddons = useMemo(() => groupItems(allAddons), [allAddons])
    const groupedMaterials = useMemo(() => groupItems(allMaterials), [allMaterials])
    
    // Закрытие по Escape
    React.useEffect(() => {
        if (!isOpen) return
        
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])
    
    const handleCopy = async () => {
        const text = generateScheduleText(order)
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            toast.success('Расписание скопировано в буфер обмена')
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error('Не удалось скопировать')
        }
    }

    // Закрытие по клику на backdrop
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }
    
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CalendarCheck className="text-green-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Генерация расписания</h2>
                            <p className="text-sm text-gray-500">Заказ ID: {order.order_id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        aria-label="Закрыть"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="space-y-6">
                        {/* Основные услуги */}
                        {order.services && order.services.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Package size={18} />
                                    Основные услуги
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Услуга</th>
                                                <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">Количество</th>
                                                <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">Цена</th>
                                                {order.services.some(s => s.diagonal) && (
                                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Диагональ</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.services.map((service, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                        {service.label}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-700">
                                                        {service.count > 1 ? `x${service.count}` : '1'}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-right text-sm text-gray-700">
                                                        ${(service.price * service.count).toFixed(2)}
                                                    </td>
                                                    {order.services.some(s => s.diagonal) && (
                                                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                                                            {service.diagonal 
                                                                ? service.diagonal.split(',').map(d => `${d.trim()} inch`).join(', ')
                                                                : '—'}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Дополнительные услуги */}
                        {groupedAddons.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Package size={18} />
                                    Дополнительные услуги
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Услуга</th>
                                                <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">Количество</th>
                                                <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">Цена</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupedAddons.map((addon, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                        {addon.label}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-700">
                                                        {addon.totalCount > 1 ? `x${addon.totalCount}` : '1'}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-right text-sm text-gray-700">
                                                        ${(addon.price * addon.totalCount).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Материалы */}
                        {groupedMaterials.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Package size={18} />
                                    Материалы
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Материал</th>
                                                <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">Количество</th>
                                                <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">Цена</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupedMaterials.map((material, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                        {material.label}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-700">
                                                        {material.totalCount > 1 ? `x${material.totalCount}` : '1'}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-3 text-right text-sm text-gray-700">
                                                        ${(material.price * material.totalCount).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Итоговая сумма */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">Итого:</span>
                                <span className="text-2xl font-bold text-gray-900">
                                    ${order.custom ? order.custom.toFixed(2) : (order.total ? order.total.toFixed(2) : '0.00')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center p-6 border-t border-gray-200">
                    <button
                        onClick={handleCopy}
                        className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex items-center gap-2"
                    >
                        <Copy size={16} />
                        {copied ? 'Скопировано!' : 'Копировать расписание'}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    )
}
