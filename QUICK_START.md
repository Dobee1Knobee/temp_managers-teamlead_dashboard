# 🚀 Быстрый запуск CRM Web HHN

## ⚠️ Важно: Версия Node.js

Проект требует **Node.js 18.x** для стабильной работы.

### Проверка версии
```bash
node --version
```

### Если у вас Node.js 23.x (несовместимо):
```bash
# Установите nvm (если не установлен)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Перезапустите терминал, затем:
nvm install 18.19.0
nvm use 18.19.0
```

## 🚀 Запуск проекта

### Способ 1: Автоматический (рекомендуется)
```bash
./start-dev.sh
```

### Способ 2: Ручной
```bash
# Очистка кэша
rm -rf .next node_modules package-lock.json

# Установка зависимостей
npm install

# Запуск
npm run dev
```

## 🔧 Решение проблем

### Ошибка "routesManifest.dataRoutes is not iterable"
```bash
# Очистите кэш Next.js
rm -rf .next

# Перезапустите приложение
npm run dev
```

### Ошибка "Found multiple lockfiles"
```bash
# Удалите лишние lockfiles
rm -rf /Users/user/package-lock.json

# Оставьте только в папке проекта
ls -la package-lock.json
```

### WebSocket проблемы
- Используйте компонент диагностики в правом нижнем углу
- Проверьте логи в консоли браузера
- См. `WEBSOCKET_TROUBLESHOOTING.md`

## 📱 Доступ к приложению

После успешного запуска:
- **Локально**: http://localhost:3000
- **В сети**: http://192.168.1.136:3000

## 🆘 Если ничего не помогает

1. Проверьте версию Node.js (должна быть 18.x)
2. Очистите все кэши: `rm -rf .next node_modules package-lock.json`
3. Переустановите зависимости: `npm install`
4. Запустите: `npm run dev`
5. Проверьте логи на наличие ошибок

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в терминале
2. Проверьте консоль браузера
3. Убедитесь, что используете Node.js 18.x
4. Обратитесь к разработчикам с логами ошибок
