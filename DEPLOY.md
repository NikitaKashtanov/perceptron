# 🚀 Инструкции по деплою на Vercel

## Шаг 1: Создание GitHub репозитория

1. Перейдите на [GitHub.com](https://github.com)
2. Нажмите "New repository"
3. Назовите репозиторий: `neural-network-digit-recognition`
4. Сделайте репозиторий публичным
5. НЕ добавляйте README, .gitignore или лицензию (они уже есть)

## Шаг 2: Загрузка кода на GitHub

```bash
# Добавьте удаленный репозиторий (замените YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/neural-network-digit-recognition.git

# Загрузите код
git branch -M main
git push -u origin main
```

## Шаг 3: Деплой на Vercel

### Вариант A: Через веб-интерфейс (Рекомендуется)

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "Sign up" и войдите через GitHub
3. Нажмите "New Project"
4. Найдите ваш репозиторий `neural-network-digit-recognition`
5. Нажмите "Import"
6. Настройки деплоя:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
7. Нажмите "Deploy"

### Вариант B: Через CLI

```bash
# Установите Vercel CLI
npm install -g vercel

# Войдите в аккаунт
vercel login

# Деплой
vercel --prod
```

## Шаг 4: Настройка кастомного домена (опционально)

1. В панели Vercel перейдите в настройки проекта
2. Выберите "Domains"
3. Добавьте ваш домен
4. Настройте DNS записи согласно инструкциям

## 🎯 Результат

После деплоя вы получите URL вида:
`https://neural-network-digit-recognition.vercel.app`

## 🔄 Автоматические обновления

После настройки каждый push в main ветку будет автоматически деплоить обновления!

## 📊 Мониторинг

В панели Vercel вы можете отслеживать:
- Статистику посещений
- Производительность
- Ошибки
- Логи

## 🛠️ Troubleshooting

### Ошибка сборки:
```bash
# Проверьте локально
npm run build
```

### Проблемы с путями:
- Убедитесь, что `vercel.json` настроен правильно
- Проверьте `homepage` в `package.json`

### Проблемы с зависимостями:
```bash
# Очистите кэш
rm -rf node_modules package-lock.json
npm install
```

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в панели Vercel
2. Убедитесь, что проект собирается локально
3. Проверьте настройки в `vercel.json`
