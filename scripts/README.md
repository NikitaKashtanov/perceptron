# Тренировочные скрипты

Эта папка содержит все скрипты для обучения и создания моделей нейросети.

## Структура

### 📁 training/
Скрипты для обучения нейросети на различных данных:
- `trainModel.js` - базовое обучение модели
- `trainImprovedModel.js` - улучшенное обучение
- `trainImprovedModelFixed.js` - исправленная версия улучшенного обучения

### 📁 model-creation/
Скрипты для создания предобученных моделей:
- `createBetterModel.js` - создание качественной модели с множественными вариациями
- `createQuickModel.js` - быстрое создание простой модели
- `createRealModel.js` - создание модели на основе реальных данных

### 📁 data-processing/
Скрипты для обработки и обучения на изображениях:
- `trainFromImages.js` - обучение на реальных изображениях цифр
- `trainFromMultipleImages.js` - обучение на множественных изображениях
- `trainFromRealImages.js` - обучение на реальных изображениях с загрузкой из интернета

## Использование

Запустите любой скрипт с помощью Node.js:

```bash
# Обучение базовой модели
node scripts/training/trainModel.js

# Создание быстрой модели
node scripts/model-creation/createQuickModel.js

# Обучение на изображениях
node scripts/data-processing/trainFromImages.js
```

## Результаты

Все скрипты создают файлы моделей в папке `public/models/` и автоматически обновляют `models.json`.
