# CRM Web HHN

Современная CRM система для управления заказами и клиентами, построенная на Next.js 15 с TypeScript.

## 🚀 Новые возможности

### ✨ Производительность
- **Web Vitals мониторинг** - отслеживание Core Web Vitals в реальном времени
- **Оптимизированные компоненты** - React.memo, useMemo, useCallback для лучшей производительности
- **Bundle анализатор** - анализ размера бандла для оптимизации
- **Code splitting** - автоматическое разделение кода на чанки

### 🧪 Тестирование
- **Jest + React Testing Library** - полная поддержка тестирования
- **Покрытие кода 70%** - автоматическая проверка качества
- **Моки и утилиты** - готовые решения для тестирования

### 🛡️ Надежность
- **Error Boundary** - глобальная обработка ошибок React
- **Performance Monitor** - визуальный монитор производительности
- **Skeleton компоненты** - улучшенный UX при загрузке

### 🎨 UX улучшения
- **Skeleton загрузка** - красивые плейсхолдеры для всех компонентов
- **Адаптивный дизайн** - оптимизация для всех устройств
- **Анимации и переходы** - плавные взаимодействия

## 🛠️ Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **State Management**: Zustand
- **Testing**: Jest, React Testing Library
- **Performance**: Web Vitals, Bundle Analyzer
- **Deployment**: Docker, Cloud Build

## 📦 Установка

```bash
# Клонирование репозитория
git clone <repository-url>
cd crm-web-hhn

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск тестов
npm test

# Анализ размера бандла
npm run analyze
```

## 🧪 Тестирование

```bash
# Запуск всех тестов
npm test

# Тесты в режиме наблюдения
npm run test:watch

# Тесты с отчетом покрытия
npm run test:coverage

# Проверка типов TypeScript
npm run type-check
```

## 🚀 Команды разработки

```bash
# Разработка с Turbopack
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен сервера
npm run start

# Линтинг кода
npm run lint

# Анализ производительности
npm run analyze
```

## 📁 Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Аутентификация
│   ├── buffer/            # Буфер заказов
│   ├── changeOrder/       # Изменение заказов
│   ├── form/              # Формы заказов
│   ├── login/             # Страница входа
│   └── myOrders/          # Мои заказы
    └── visits/            # Система проверки визитов мастеров
├── components/             # React компоненты
│   ├── ErrorBoundary.tsx  # Обработка ошибок
│   ├── Skeleton.tsx       # Компоненты загрузки
│   └── PerformanceMonitor.tsx # Монитор производительности
├── hooks/                  # Кастомные хуки
│   ├── usePerformance.ts  # Хук производительности
│   └── useSocket.ts       # WebSocket хук
├── stores/                 # Zustand сторы
├── types/                  # TypeScript типы
└── utils/                  # Утилиты
```

## 🔧 Конфигурация

### Next.js
- Экспериментальные фичи для производительности
- Оптимизация изображений
- Безопасность через HTTP заголовки
- Webpack оптимизации

### Jest
- Настройка для Next.js
- Моки для браузерных API
- Покрытие кода 70%
- TypeScript поддержка

## 📊 Мониторинг

### Web Vitals
- **CLS** - Cumulative Layout Shift
- **FID** - First Input Delay  
- **FCP** - First Contentful Paint
- **LCP** - Largest Contentful Paint
- **TTFB** - Time to First Byte

### Производительность
- Мониторинг памяти браузера
- Отслеживание длительных задач
- Анализ загрузки ресурсов
- Автоматическая отчетность

## 🚀 Деплой

```bash
# Сборка Docker образа
docker build -t crm-web-hhn .

# Запуск контейнера
docker run -p 3000:3000 crm-web-hhn

# Cloud Build (автоматический)
# Проект настроен для автоматического деплоя
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте feature branch
3. Добавьте тесты для новой функциональности
4. Создайте Pull Request

## 📚 Документация

Подробная документация по улучшениям: [IMPROVEMENTS.md](./IMPROVEMENTS.md)

## 📞 Поддержка

- Создайте Issue в репозитории
- Обратитесь к команде разработки
- Проверьте существующую документацию

## 📄 Лицензия

MIT License
