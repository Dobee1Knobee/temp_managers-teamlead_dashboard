// src/app/form/components/Sidebar.tsx
'use client';

import ConnectionStatus from '@/components/ConnectionStatus'
import { useOrderStore } from '@/stores/orderStore'
import Order from "@/types/formDataType"
import {
    AlertTriangle,
    Calendar,
    Car,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    FileBarChart,
    FileText,
    Folder,
    Lock,
    MessageSquare,
    Phone,
    Plus,
    Search,
    User,
    Users
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ConfidentialViewModal from './ConfidentialViewModal'

export default function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<
        'new-order' | 'buffer' | 'my-orders' | 'search' | 'visit' | 'schedule' | 'messages' | 'managers' | 'clientlogs' | 'needs-action' | null
    >(null);

    // Состояния для поиска
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const unclaimedRequests = useOrderStore(state => state.unclaimedRequests);

    // Состояния для модалки конфиденциальности
    const [selectedNotMyOrder, setSelectedNotMyOrder] = useState<Order>();
    const [showConfidentialModal, setShowConfidentialModal] = useState(false);

    const router = useRouter();
    const userTeam = useOrderStore(state => state.currentUser?.team);
    // Данные из store
    const {
        orders,
        searchResults,
        isSearching,
        searchOrders,
        clearSearchResults,
        viewNotMyOrder,
        currentUser,
        formData,
        getByLeadID
    } = useOrderStore();
    const bufferCount = useOrderStore(state => state.bufferStats.totalCount);
    const { isSocketConnected,} = useOrderStore();

    //Заклейменные заказы
    const noteOfClaimedOrder = useOrderStore(state => state.noteOfClaimedOrder);
    const clearClaimedOrders = useOrderStore(state => state.clearClaimedOrders);
    const syncClaimedOrders = useOrderStore(state => state.syncClaimedOrders);
 
    // Загрузка активного таба
    useEffect(() => {
        const saved = localStorage.getItem('activeTab') as
            | 'new-order' | 'buffer' | 'my-orders' | 'search' | 'visit' | null;
        if (saved) {
            setActiveTab(saved);
        }
    }, []);

    // Синхронизация заклейменных заказов при загрузке
    useEffect(() => {
        const syncedOrders = syncClaimedOrders();
    }, [syncClaimedOrders]);

    // Сохранение активного таба
    useEffect(() => {
        if (activeTab) {
            localStorage.setItem('activeTab', activeTab);
        }
    }, [activeTab]);

    // Debounced поиск
    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        if (searchQuery.trim() && searchQuery.length >= 3) {
            const timeout = setTimeout(() => {
                searchOrders(searchQuery);
            }, 500);

            setSearchTimeout(timeout);
        } else if (searchQuery.length === 0) {
            clearSearchResults();
        }

        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);    
            }
        };
    }, [searchQuery]);

    // Navigation handler
    const handleClick = (tab: 'new-order' | 'buffer' | 'my-orders' | 'search' | 'visit' | 'schedule' | 'messages' | 'managers' | 'clientlogs' | 'needs-action') => {
        setActiveTab(tab);

        switch (tab) {
            case 'new-order':
                router.push('/form');
                break;
            case 'buffer':
                router.push('/buffer');
                break;
            case 'my-orders':
                router.push('/myOrders');
                break;
            case 'visit':
                router.push('/visits');
                break;
            case 'schedule':
                router.push('/schedule');
                break;
            case 'search':
                if(!isExpanded) {
                    setIsExpanded(true);
                }
                break;
            case 'messages':
                router.push('/messages');
                break;
            case 'managers':
                router.push('/managers');
                break;
            case 'clientlogs':
                router.push('/clientlogs');
                break;
            case 'needs-action':
                router.push('/needs-action');
                break;
        }
    };

    // Обработка клика по своему заказу
    const handleMyOrderClick = async (order:Order) => {
        try {
            // Очищаем режим просмотра при обычном переходе
            localStorage.removeItem('viewModeUserTeam');
            await getByLeadID(order.order_id);
            router.push('/changeOrder');
        } catch (error) {
            console.error('Failed to load order:', error);
        }
    };

    // Обработка клика по чужому заказу
    const handleNotMyOrderClick = (order :Order) => {
        setSelectedNotMyOrder(order);
        setShowConfidentialModal(true);
    };

    // Подтверждение просмотра чужого заказа
    const handleConfirmView = async () => {
        if (selectedNotMyOrder) {
            // Очищаем режим просмотра при обычном переходе
            localStorage.removeItem('viewModeUserTeam');
            await viewNotMyOrder(selectedNotMyOrder.order_id);
            await getByLeadID(selectedNotMyOrder.order_id);
            setShowConfidentialModal(false);
            router.push('/changeOrder');
        }
    };

    // Отмена просмотра
    const handleCancelView = () => {
        setSelectedNotMyOrder(undefined);
        setShowConfidentialModal(false);
    };

    // Форматирование суммы
    const formatCurrency = (amount: number | undefined) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    return (
        <div className="min-h-screen flex">
            <div className={`
                bg-white shadow-lg transition-all duration-300 ease-out
                ${isExpanded ? 'w-72' : 'w-16'} flex flex-col border-r border-gray-100
            `}>
                {/* Compact Header */}
                <div className="p-2 border-b border-gray-100 bg-gray-50">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-200 shadow-sm border border-gray-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        title={isExpanded ? "Свернуть" : "Развернуть"}
                    >
                        {isExpanded ? (
                            <ChevronLeft size={16} className="text-gray-600" />
                        ) : (
                            <ChevronRight size={16} className="text-gray-600" />
                        )}
                    </button>
                </div>
  
               
                <div className="flex-1 overflow-hidden">
                    {isExpanded && userTeam === 'H' ? (
                        /* Team H (Team Leads) - Special Sidebar */
                        <div className="p-2 space-y-2 h-full flex flex-col">
                            {/* Team H Header */}
                            <div className="flex-shrink-0">
                                <div className="mb-2 px-1">
                                    <h3 className="text-xs font-semibold text-gray-600 mb-1">👑 Team Lead Dashboard</h3>
                                </div>
                            </div>

                            {/* Team H Navigation Buttons */}
                            <div className="flex-shrink-0 space-y-1.5">
                                <button
                                    onClick={() => handleClick('managers')}
                                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
                                        activeTab === 'managers'
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                    }`}
                                >
                                    <Users size={14} />
                                    <span>Managers</span>
                                </button>

                                <button
                                    onClick={() => handleClick('clientlogs')}
                                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
                                        activeTab === 'clientlogs'
                                            ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                    }`}
                                >
                                    <FileBarChart size={14} />
                                    <span>Client Logs</span>
                                </button>

                                <button
                                    onClick={() => handleClick('needs-action')}
                                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
                                        activeTab === 'needs-action'
                                            ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                    }`}
                                >
                                    <AlertTriangle size={14} />
                                    <span>Needs Action</span>
                                </button>
                            </div>

                            {/* Connection Status for Team H */}
                            <div className="flex-shrink-0">
                                <ConnectionStatus />
                            </div>
                        </div>
                    ) : isExpanded && userTeam !== 'H' ? (
                        <div className="p-2 space-y-2 h-full flex flex-col">
                            {/* Simple Notes for Conversation */}
                            <div className="flex-shrink-0">
                                <div className="mb-2 px-1">
                                    <h3 className="text-xs font-semibold text-gray-600 mb-1">📝 Conversation Notes</h3>
                                </div>
                            
                                {noteOfClaimedOrder && Array.isArray(noteOfClaimedOrder) && noteOfClaimedOrder.length > 0 ? (
                                    <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                        {noteOfClaimedOrder.map(order => (
                                            <div key={order.telephone} className="bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded-r-lg shadow-sm hover:shadow-md transition-shadow">
                                                {/* Customer Name - Header */}
                                                <div className="font-semibold text-sm text-gray-800 mb-1">
                                                    👤 {order.name || 'No name'}
                                                </div>
                                                
                                                {/* Quick Info - Inline */}
                                                <div className="text-xs text-gray-600 mb-2 space-y-0.5">
                                                    {order.text.size && (
                                                        <div><span className="font-medium">📺 Size:</span> {order.text.size}</div>
                                                    )}
                                                    {order.text.mountType && (
                                                        <div><span className="font-medium">🔧 Mount:</span> {order.text.mountType}</div>
                                                    )}
                                                    {order.text.surfaceType && (
                                                        <div><span className="font-medium">🏠 Surface:</span> {order.text.surfaceType}</div>
                                                    )}
                                                    {order.text.wires && (
                                                        <div><span className="font-medium">🔌 Wires:</span> {order.text.wires}</div>
                                                    )}
                                                    {order.text.addons && (
                                                        <div><span className="font-medium">➕ Add-ons:</span> {order.text.addons}</div>
                                                    )}
                                                </div>
                                        
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-3 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        <FileText size={12} className="mx-auto text-gray-300 mb-1" />
                                        <div className="text-xs text-gray-500">No conversation notes</div>
                                        <div className="text-xs text-gray-400 mt-1">Process requests to create notes</div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Compact Connection Status */}
                            <div className="flex-shrink-0">
                                <ConnectionStatus />
                            </div>

                            {/* Ultra-compact Navigation Buttons */}
                            <div className="flex-shrink-0 space-y-1.5">
                                <button
                                    onClick={() => handleClick('new-order')}
                                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
                                        activeTab === 'new-order'
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                    }`}
                                >
                                    <Plus size={14} />
                                    <span>New Order</span>
                                </button>

                                <button
                                    onClick={() => handleClick('buffer')}
                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
                                        activeTab === 'buffer'
                                            ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <ClipboardList size={14} />
                                        <span>Buffer</span>
                                    </div>
                                    {bufferCount > 0 && (
                                        <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                                            {bufferCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleClick('messages')}
                                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
                                        activeTab === 'messages'
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                    }`}
                                >
                                    <MessageSquare size={14} />
                                    <span>Messages</span>
                                </button>
                                <button
                                    onClick={() => handleClick('my-orders')}
                                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
                                        activeTab === 'my-orders'
                                            ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                    }`}
                                >
                                    <Folder size={14} />
                                    <span>My Orders</span>
                                </button>
                                <button
                                    onClick={() => handleClick('visit')}
                                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
                                        activeTab === 'visit'
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                    }`}
                                >
                                    <Car size={14} />
                                    <span>Visits</span>
                                </button>
                                <button
                                    onClick={() => handleClick('schedule')}
                                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
                                        activeTab === 'schedule'
                                            ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                    }`}
                                >
                                    <Calendar size={14} />  
                                    <span>Schedule</span>
                                </button>
                                <button
                                    onClick={() => handleClick('search')}
                                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
                                        activeTab === 'search'
                                            ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                    }`}
                                >
                                    <Search size={14} />
                                    <span>Search</span>
                                </button>
                            </div>

                            {/* Ultra-compact Search section */}
                            {activeTab === 'search' && (
                                <div className="flex-1 flex flex-col min-h-0 space-y-2">
                                    {/* Search input */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Order ID, Phone, ZIP..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full p-1.5 pl-7 border border-gray-200 rounded-lg bg-gray-50 focus:border-blue-400 focus:bg-white transition-colors duration-200 text-xs"
                                        />
                                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Search size={12} />
                                        </div>
                                        {isSearching && (
                                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Compact Search hints */}
                                    {!searchQuery && (
                                        <div className="text-xs text-gray-500 p-1.5 bg-gray-50 rounded-lg">
                                            <div className="font-medium mb-1">Examples:</div>
                                            <div>• AH0730003</div>
                                            <div>• 1234567890</div>
                                        </div>
                                    )}

                                    {/* Ultra-compact Search results */}
                                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                        {searchResults && searchResults.counts.total > 0 ? (
                                            <>
                                                {/* Summary */}
                                                <div className="text-xs text-gray-600 p-1.5 bg-gray-50 rounded-lg">
                                                    Found {searchResults.counts.total} orders
                                                    ({searchResults.counts.my} mine, {searchResults.counts.notMy} others)
                                                </div>

                                                {/* My orders */}
                                                {searchResults.myOrders.map(order => (
                                                    <div
                                                        key={order._id}
                                                        onClick={() => handleMyOrderClick(order)}
                                                        className="bg-green-50 border border-green-200 rounded-lg p-1.5 hover:shadow-sm transition-all duration-200 cursor-pointer"
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="font-semibold text-green-800 text-xs">
                                                                {order.order_id}
                                                            </div>
                                                            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                                                Mine
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                                            <User size={10} />
                                                            {order.leadName || 'No name'}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                                            <Phone size={10} />
                                                            {order.phone || 'No phone'}
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-500">
                                                                {order.text_status || 'No status'}
                                                            </span>
                                                            <span className="font-semibold text-green-700 text-xs">
                                                                {formatCurrency(order.total)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Not my orders */}
                                                {searchResults.notMyOrders.map(order => (
                                                    <div
                                                        key={order._id}
                                                        onClick={() => handleNotMyOrderClick(order)}
                                                        className="bg-orange-50 border border-orange-200 rounded-lg p-1.5 hover:shadow-sm transition-all duration-200 cursor-pointer"
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="font-semibold text-orange-800 text-xs">
                                                                {order.order_id}
                                                            </div>
                                                            <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                                                <Lock size={8} />
                                                                {order.owner}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                                            <User size={10} />
                                                            {order.leadName || 'No name'}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                                            <Phone size={10} />
                                                            ••••••••••
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-500">
                                                                {order.text_status || 'No status'}
                                                            </span>
                                                            <span className="font-semibold text-orange-700 text-xs">
                                                                {formatCurrency(order.total)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : searchResults && searchQuery ? (
                                            <div className="text-center py-4 text-gray-500">
                                                <div className="mb-1">
                                                    <Search size={20} className="mx-auto text-gray-400" />
                                                </div>
                                                <div className="text-xs">No orders found</div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : userTeam === 'H' ? (
                        /* Team H Collapsed Sidebar */
                        <div className="p-2 space-y-2">
                            <button
                                onClick={() => handleClick('managers')}
                                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                    activeTab === 'managers'
                                        ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                }`}
                                title="Managers"
                            >
                                <Users size={16} />
                            </button>

                            <button
                                onClick={() => handleClick('clientlogs')}
                                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                    activeTab === 'clientlogs'
                                        ? 'bg-green-50 text-green-600 shadow-sm border border-green-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                }`}
                                title="Client Logs"
                            >
                                <FileBarChart size={16} />
                            </button>

                            <button
                                onClick={() => handleClick('needs-action')}
                                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                    activeTab === 'needs-action'
                                        ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                }`}
                                title="Needs Action"
                            >
                                <AlertTriangle size={16} />
                            </button>
                        </div>
                    ) : (
                        /* Ultra-compact collapsed sidebar */
                        <div className="p-2 space-y-2">
                            {/* Claimed Orders Count - Compact */}
                            {noteOfClaimedOrder && Array.isArray(noteOfClaimedOrder) && noteOfClaimedOrder.length > 0 && (
                                <div className="text-center mb-2">
                                    <div className="w-12 h-8 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-700">{noteOfClaimedOrder.length}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Orders</div>
                                </div>
                            )}

                            <button
                                onClick={() => handleClick('new-order')}
                                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                    activeTab === 'new-order'
                                        ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                }`}
                                title="New Order"
                            >
                                <Plus size={16} />
                            </button>

                            <button
                                onClick={() => handleClick('buffer')}
                                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 relative ${
                                    activeTab === 'buffer'
                                        ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                }`}
                                title="Buffer"
                            >
                                <ClipboardList size={16} />
                                {bufferCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {bufferCount}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => handleClick('my-orders')}
                                className={`relative w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                    activeTab === 'my-orders'
                                        ? 'bg-green-50 text-green-600 shadow-sm border border-green-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                }`}
                                title="My Orders"
                            >
                                <Folder size={16} />
                                {/* Красивый счетчик неполученных заказов */}
                                {unclaimedRequests.length > 0 && (
                                    <span className="absolute -top-2 -right-2 text-white text-xs min-w-[24px] h-[24px] px-1 rounded-full flex items-center justify-center font-bold shadow-xl border-2 border-white z-20 transition-all duration-300 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 animate-bounce shadow-orange-500/50">
                                        {unclaimedRequests.length > 99 ? '99+' : unclaimedRequests.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => handleClick('visit')}
                                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                    activeTab === 'visit'
                                        ? 'bg-green-50 text-green-600 shadow-sm border border-green-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                }`}
                                title="Visit"
                            >
                                <Car size={16} />
                            </button>
                            <button
                                    onClick={() => handleClick('messages')}
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                        activeTab === 'messages'
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                    }`}
                                >
                                    <MessageSquare size={14} />
                                </button>
                            <button
                                onClick={() => handleClick('schedule')}
                                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                        activeTab === 'schedule'
                                            ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                }`}
                                title="New Order"
                            >
                                <Calendar size={16} />
                            </button>
                            <button
                                onClick={() => handleClick('search')}
                                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                    activeTab === 'search'
                                        ? 'bg-purple-50 text-purple-600 shadow-sm border border-purple-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:border-gray-200 border border-transparent'
                                }`}
                                title="Search"
                            >
                                <Search size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Модальное окно конфиденциальности */}
            {showConfidentialModal && (
                <ConfidentialViewModal
                    isOpen={showConfidentialModal}
                    onConfirm={() => {
                        handleConfirmView();
                    }}
                    onCancel={() => {
                        handleCancelView();
                    }}
                    orderInfo={selectedNotMyOrder ? {
                        order_id: selectedNotMyOrder.order_id,
                        owner: selectedNotMyOrder.owner,
                        leadName: selectedNotMyOrder.leadName,
                        text_status: selectedNotMyOrder.text_status
                    } : {
                        order_id: undefined,
                        owner: undefined,
                        leadName: undefined,
                        text_status: undefined
                    }}
                />
            )}

            {/* Main content area */}
            <div className="flex-1">
                {/* Ваш основной контент здесь */}
            </div>
        </div>
    );
}