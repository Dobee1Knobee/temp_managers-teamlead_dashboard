# 🔌 WebSocket Troubleshooting Guide

## 🚨 Основные проблемы и их решения

### 1. **WebSocket connection failed: WebSocket is closed before the connection is established**

#### Причины:
- Сервер недоступен или перезагружается
- Проблемы с сетевым подключением
- Блокировка корпоративным файрволом
- Неправильные настройки CORS на сервере
- Таймауты соединения

#### Решения:

##### A. Проверка сервера
```bash
# Проверьте доступность сервера
curl -I https://bot-crm-backend-756832582185.us-central1.run.app/health

# Проверьте WebSocket endpoint
curl -I https://bot-crm-backend-756832582185.us-central1.run.app/socket.io/
```

##### B. Проверка сетевого подключения
- Убедитесь, что интернет соединение стабильно
- Проверьте, не блокирует ли корпоративный файрвол WebSocket соединения
- Попробуйте подключиться с другого устройства/сети

##### C. Настройки браузера
- Очистите кэш и cookies
- Отключите расширения, которые могут блокировать WebSocket
- Проверьте настройки безопасности браузера

### 2. **Улучшенная конфигурация WebSocket**

В проекте уже реализованы следующие улучшения:

#### Fallback транспорты
```typescript
const socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'], // Fallback на polling
    reconnection: true,
    reconnectionAttempts: 20,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    timeout: 30000,
    upgrade: true,
    rememberUpgrade: true
});
```

#### Heartbeat механизм
```typescript
// Каждые 25 секунд отправляем keep-alive
const heartbeatInterval = setInterval(() => {
    if (socket.connected) {
        socket.emit('keep-alive');
    }
}, 25000);
```

#### Обработка ошибок
```typescript
socket.on('connect_error', (error) => {
    console.error('Ошибка подключения:', error);
    toast.error(`Ошибка подключения: ${error.message}`);
});

socket.on('reconnect', (attemptNumber) => {
    console.log(`Переподключен после ${attemptNumber} попыток`);
    toast.success('Соединение восстановлено');
});
```

### 3. **Диагностика проблем**

#### Встроенная диагностика
В правом нижнем углу экрана есть компонент `WebSocketStatus` с кнопкой "🔍 Диагностика". Нажмите на неё для автоматической проверки:

- Доступности сервера
- Времени ответа
- Поддержки WebSocket в браузере
- Качества соединения

#### Ручная диагностика в консоли
```javascript
// Проверьте состояние WebSocket
console.log('Socket connected:', socket?.connected);
console.log('Socket transport:', socket?.io?.engine?.transport?.name);
console.log('Socket readyState:', socket?.readyState);

// Проверьте URL сервера
console.log('Socket URL:', 'https://bot-crm-backend-756832582185.us-central1.run.app');
```

### 4. **Переменные окружения**

Создайте файл `.env.local` в корне проекта:

```bash
# WebSocket Configuration
NEXT_PUBLIC_SOCKET_URL=https://bot-crm-backend-756832582185.us-central1.run.app

# Fallback URLs (если основной сервер недоступен)
NEXT_PUBLIC_SOCKET_FALLBACK_1=https://backup-server-1.example.com
NEXT_PUBLIC_SOCKET_FALLBACK_2=https://backup-server-2.example.com

# WebSocket Timeouts
NEXT_PUBLIC_SOCKET_TIMEOUT=30000
NEXT_PUBLIC_SOCKET_RECONNECTION_ATTEMPTS=20
NEXT_PUBLIC_SOCKET_RECONNECTION_DELAY=1000
```

### 5. **Мониторинг и логирование**

#### Логи в консоли
Все WebSocket события логируются в консоль браузера с эмодзи для удобства:

- 🔌 Подключение
- ✅ Успешное подключение
- ❌ Ошибки
- 🔄 Переподключение
- 💓 Heartbeat
- ⚠ Отключение

#### Уведомления пользователю
- Toast уведомления о статусе соединения
- Автоматические уведомления об ошибках
- Информация о переподключении

### 6. **Профилактические меры**

#### Регулярные проверки
- Мониторинг состояния сервера
- Проверка качества соединения
- Анализ логов ошибок

#### Graceful degradation
- Fallback на polling при проблемах с WebSocket
- Автоматическое переподключение
- Сохранение состояния при переподключении

### 7. **Контакты для поддержки**

При возникновении проблем:

1. **Сначала** используйте встроенную диагностику
2. **Проверьте** логи в консоли браузера
3. **Убедитесь**, что сервер доступен
4. **Обратитесь** к разработчикам с логами ошибок

### 8. **Полезные команды**

```bash
# Перезапуск приложения
npm run dev

# Очистка кэша
npm run build && npm start

# Проверка зависимостей
npm audit
npm outdated
```

---

## 📚 Дополнительные ресурсы

- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [WebSocket API MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Troubleshooting Network Issues](https://developer.chrome.com/docs/devtools/network/)
