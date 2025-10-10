"use client";
import { useOrderStore } from "@/stores/orderStore"
import { useEffect, useState } from "react"

interface ConnectionStatusProps {
    showDetails?: boolean;
    className?: string;
    variant?: 'sidebar' | 'header';
}

export default function ConnectionStatus({ showDetails = true, className = "", variant = 'sidebar' }: ConnectionStatusProps) {
    const isSocketConnected = useOrderStore(state => state.isSocketConnected);
    const currentUser = useOrderStore(state => state.currentUser);
    const autoReconnect = useOrderStore(state => state.autoReconnect);
    const [isReconnecting, setIsReconnecting] = useState(false);

    const handleReconnect = async () => {
        if (isReconnecting) return;
        
        setIsReconnecting(true);
        try {
            await autoReconnect();
        } catch (error) {
            console.error("Reconnection failed:", error);
        } finally {
            setTimeout(() => setIsReconnecting(false), 2000);
        }
    };

    useEffect(() => {
        if (isSocketConnected) {
            setIsReconnecting(false);
        }
    }, [isSocketConnected]);

    // Периодическая проверка соединения
    useEffect(() => {
        if (!currentUser) return;

        const checkConnection = () => {
            const socket = (window as any).__socketInstance;
            if (socket && !socket.connected && !isReconnecting) {
                console.log('🔄 Обнаружено отключение в ConnectionStatus, переподключаемся...');
                autoReconnect();
            }
        };

        // Проверяем каждые 30 секунд
        const interval = setInterval(checkConnection, 30000);
        
        return () => clearInterval(interval);
    }, [currentUser, isReconnecting, autoReconnect]);

    // Стили для разных вариантов
    const getStyles = () => {
        if (variant === 'header') {
            return {
                container: "bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-200",
                connected: "bg-green-50 border-green-200",
                disconnected: "bg-blue-50 border-blue-200",
                indicator: "w-2 h-2",
                text: "text-xs font-medium",
                button: "bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            };
        }
        
        // sidebar variant - максимально компактный
        return {
            container: "bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-200",
            connected: "bg-green-50 border-green-200",
            disconnected: "bg-blue-50 border-blue-200",
            indicator: "w-2 h-2",
            text: "text-xs font-medium",
            button: "bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        };
    };

    const styles = getStyles();

    if (isSocketConnected) {
        return (
            <div className={`${styles.container} ${styles.connected} ${className}`}>
                <div className="flex items-center gap-2">
                    <div className={`${styles.indicator} bg-green-500 rounded-full animate-pulse`}></div>
                    {showDetails && (
                        <span className={`${styles.text} text-green-700`}>Connected</span>
                    )}
                </div>
                {showDetails && currentUser?.team && (
                    <div className="mt-1.5">
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium border border-green-200">
                            Team {currentUser.team}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${styles.disconnected} ${className}`}>
            <div className="flex items-center gap-2">
                {isReconnecting ? (
                    <div className={`${styles.indicator} bg-blue-500 rounded-full animate-pulse`}></div>
                ) : (
                    <div className={`${styles.indicator} bg-blue-500 rounded-full`}></div>
                )}
                {showDetails && (
                    <span className={`${styles.text} text-blue-700`}>
                        {isReconnecting ? "Reconnecting..." : "Connection lost"}
                    </span>
                )}
            </div>
            {showDetails && (
                <div className="mt-1.5">
                    {isReconnecting ? (
                        <div className="flex items-center gap-2 text-xs text-blue-600">
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-400 border-t-transparent"></div>
                            <span className="font-medium">Reconnecting...</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleReconnect}
                            disabled={isReconnecting}
                            className={`${styles.button} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Reconnect
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
