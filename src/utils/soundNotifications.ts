// === ЗВУКОВЫЕ УВЕДОМЛЕНИЯ ===
// Универсальная система звуковых уведомлений для всех браузеров
// Поддерживает десктоп, мобильные устройства и все современные браузеры

// Базовый звук в формате base64 (встроенный в код, не требует загрузки файлов)
const NOTIFICATION_SOUND = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7bllHgU6k9n1unEiBC13yO/eizEIHWq+8+OWT';

// Состояние системы звука
let soundPermissionGranted = false; // Получили ли разрешение на звук
let userInteracted = false; // Взаимодействовал ли пользователь со страницей

// Инициализация звуковой системы
// Вызывается при первом взаимодействии пользователя со страницей
export const initializeSoundNotifications = () => {
  userInteracted = true;
  
  // Пробуем получить разрешение на звук через тихое воспроизведение
  try {
    const audio = new Audio(NOTIFICATION_SOUND);
    audio.volume = 0.01; // Очень тихо, чтобы не раздражать
    audio.play().then(() => {
      soundPermissionGranted = true;
      console.log('🔊 Звуковые уведомления включены');
    }).catch(() => {
      console.log('🔇 Браузер заблокировал звуковые уведомления');
    });
  } catch (e) {
    console.log('🔇 Звук не поддерживается');
  }
};

// Основная функция воспроизведения звукового уведомления
export const playNotificationSound = () => {
  // Проверяем, что пользователь уже взаимодействовал со страницей
  if (!userInteracted) {
    console.log('🔇 Звук заблокирован: пользователь не взаимодействовал со страницей');
    return;
  }

  try {
    // Способ 1: Используем встроенный Audio API
    const audio = new Audio(NOTIFICATION_SOUND);
    audio.volume = 0.25; // 25% громкости - мягкий звук
    audio.preload = 'auto'; // Предзагружаем для быстрого воспроизведения
    
    // Воспроизводим только если страница в фокусе (не в фоне)
    if (document.hasFocus()) {
      audio.play().catch((e) => {
        console.log('🔇 Не удалось воспроизвести звук:', e.message);
        // Если не получилось - используем системный звук
        playSystemBeep();
      });
    } else {
      // Если страница в фоне - используем системный звук
      playSystemBeep();
    }
  } catch (e) {
    console.log('🔇 Ошибка создания аудио:', e);
    // Если совсем ничего не работает - системный звук
    playSystemBeep();
  }
};

// Системный звук через Web Audio API (запасной вариант)
// Создает приятный аккорд в стиле macOS уведомлений
const playSystemBeep = () => {
  try {
    // Создаем аудио контекст (современный способ работы со звуком)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Функция для создания отдельной ноты
    const createTone = (frequency: number, startTime: number, duration: number, volume: number) => {
      const oscillator = audioContext.createOscillator(); // Генератор звука
      const gainNode = audioContext.createGain(); // Контроль громкости
      
      // Соединяем компоненты: генератор -> громкость -> выход
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Настройки звука
      oscillator.frequency.setValueAtTime(frequency, startTime); // Частота ноты
      oscillator.type = 'sine'; // Синусоидальная волна (самый мягкий звук)
      
      // Плавное затухание звука
      gainNode.gain.setValueAtTime(0, startTime); // Начинаем с тишины
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01); // Быстро набираем громкость
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Плавно затухаем
      
      // Запускаем и останавливаем генератор
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const now = audioContext.currentTime;
    
    // Создаем аккорд из трех нот (мажорное трезвучие)
    createTone(523.25, now, 0.4, 0.15);      // C5 (до) - основная нота
    createTone(659.25, now + 0.05, 0.35, 0.12); // E5 (ми) - с задержкой 50ms
    createTone(783.99, now + 0.1, 0.3, 0.1);    // G5 (соль) - с задержкой 100ms
    
  } catch (e) {
    console.log('🔇 Системный звук не работает:', e);
    // Если и это не работает - используем вибрацию
    playVibration();
  }
};

// Вибрация для мобильных устройств (последний запасной вариант)
const playVibration = () => {
  try {
    if ('vibrate' in navigator) {
      // Мягкая двойная вибрация: импульс-пауза-импульс
      navigator.vibrate([100, 50, 100]); // 100ms вибрация, 50ms пауза, 100ms вибрация
    }
  } catch (e) {
    console.log('🔇 Вибрация не поддерживается:', e);
  }
};

// Комбинированное уведомление: звук + вибрация одновременно
export const playFullNotification = () => {
  playNotificationSound();
  playVibration();
};

// Проверяем, поддерживает ли браузер звук
export const isSoundSupported = (): boolean => {
  try {
    return !!(window.Audio || (window as any).webkitAudioContext);
  } catch {
    return false;
  }
};

// Получаем статус звуковой системы (для отладки)
export const getSoundStatus = () => {
  return {
    supported: isSoundSupported(),
    permissionGranted: soundPermissionGranted,
    userInteracted: userInteracted
  };
};
