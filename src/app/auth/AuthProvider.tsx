"use client";
import { useOrderStore } from "@/stores/orderStore"
import { useEffect, useRef } from "react"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const currentUser        = useOrderStore(s => s.currentUser);
    const isSocketConnected  = useOrderStore(s => s.isSocketConnected);
    const connectSocket      = useOrderStore(s => s.connectSocket);
    const autoReconnect      = useOrderStore(s => s.autoReconnect);
    const initFromStorage    = useOrderStore(s => s.initFromStorage);
    const initializeSound    = useOrderStore(s => s.initializeSound);

    // 1) На первом маунте подтянуть пользователя из sessionStorage (если его ещё нет)
    const initedRef = useRef(false);
    useEffect(() => {
        if (initedRef.current) return;
        initedRef.current = true;

        if (!currentUser) {
            try {
                initFromStorage(); // синхронно кладёт user в стор, если он есть в sessionStorage
            } catch (e) {
                console.error("initFromStorage error:", e);
            }
        }
    }, [currentUser, initFromStorage]);

    // 2) Как только пользователь известен — гарантированно подключаем сокет один раз
    useEffect(() => {
        if (!currentUser?.team || !currentUser?.userName) return;
        if (isSocketConnected) return;
        connectSocket(); // idempotent: внутри должен проверять, что сокет ещё не подключён
    }, [currentUser?.team, currentUser?.userName, isSocketConnected, connectSocket]);

    // 3) Если вкладка вернулась на передний план — проверяем соединение более умно
    useEffect(() => {
        const onVisible = () => {
            if (document.visibilityState === "visible" && currentUser) {
                // Проверяем реальное состояние сокета, а не только флаг isSocketConnected
                const socket = (window as any).__socketInstance;
                const isReallyConnected = socket?.connected;
                
                console.log('👁️ Вкладка стала видимой, состояние сокета:', {
                    isSocketConnected,
                    isReallyConnected,
                    readyState: socket?.io?.engine?.readyState
                });
                
                // Используем autoReconnect для умного переподключения
                if (!socket || !isReallyConnected) {
                    console.log('🔄 Переподключаем сокет после возврата вкладки');
                    autoReconnect();
                } else {
                    console.log('♻️ Сокет уже активен, переподключение не нужно');
                }
            }
        };
        document.addEventListener("visibilitychange", onVisible);
        return () => document.removeEventListener("visibilitychange", onVisible);
    }, [currentUser, isSocketConnected, autoReconnect]);

    // 4) Инициализация звуковых уведомлений при первом взаимодействии
    useEffect(() => {
        let initialized = false;
        
        const handleFirstInteraction = () => {
            if (initialized) return;
            initialized = true;
            
            console.log('🔊 Initializing sound notifications...');
            initializeSound();
            
            // Удаляем обработчики после первого взаимодействия
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('mousemove', handleFirstInteraction);
            document.removeEventListener('scroll', handleFirstInteraction);
        };

        // Добавляем обработчики для первого взаимодействия
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
        document.addEventListener('mousemove', handleFirstInteraction);
        document.addEventListener('scroll', handleFirstInteraction);

        return () => {
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('mousemove', handleFirstInteraction);
            document.removeEventListener('scroll', handleFirstInteraction);
        };
    }, [initializeSound]);

    return <>{children}</>;
}
