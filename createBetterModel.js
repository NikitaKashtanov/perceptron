// Создание качественной предобученной модели с множественными вариациями

const fs = require('fs');
const path = require('path');

// Простая сигмоидальная функция
const sigmoid = (x) => {
  x = Math.max(-10, Math.min(10, x));
  return 1 / (1 + Math.exp(-x));
};

// Рисование линии между двумя точками
const drawLine = (field, x1, y1, x2, y2) => {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  let x = x1;
  let y = y1;

  while (true) {
    if (x >= 0 && x < field[0].length && y >= 0 && y < field.length) {
      field[y][x] = 1;
    }

    if (x === x2 && y === y2) break;
    
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
};

// Рисование окружности
const drawCircle = (field, centerX, centerY, radius) => {
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[0].length; x++) {
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (Math.abs(distance - radius) <= 1) {
        field[y][x] = 1;
      }
    }
  }
};

// Создание пустого поля
const createEmptyField = (width, height) => {
  return Array(height).fill().map(() => Array(width).fill(0));
};

// Генерация множественных вариаций цифры 0
const generateDigit0Variations = (width, height) => {
  const variations = [];
  
  // Вариация 1: Классическая окружность
  const field1 = createEmptyField(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  drawCircle(field1, centerX, centerY, radius);
  variations.push(field1.flat());
  
  // Вариация 2: Окружность больше
  const field2 = createEmptyField(width, height);
  drawCircle(field2, centerX, centerY, radius * 1.2);
  variations.push(field2.flat());
  
  // Вариация 3: Окружность меньше
  const field3 = createEmptyField(width, height);
  drawCircle(field3, centerX, centerY, radius * 0.8);
  variations.push(field3.flat());
  
  // Вариация 4: Окружность смещена влево
  const field4 = createEmptyField(width, height);
  drawCircle(field4, centerX - 2, centerY, radius);
  variations.push(field4.flat());
  
  // Вариация 5: Окружность смещена вправо
  const field5 = createEmptyField(width, height);
  drawCircle(field5, centerX + 2, centerY, radius);
  variations.push(field5.flat());
  
  return variations;
};

// Генерация множественных вариаций цифры 1
const generateDigit1Variations = (width, height) => {
  const variations = [];
  
  for (let i = 0; i < 3; i++) {
    const field = createEmptyField(width, height);
    const centerX = width / 2 + (Math.random() - 0.5) * 4; // Небольшое смещение
    
    // Вертикальная линия
    drawLine(field, centerX, height * 0.2, centerX, height * 0.8);
    
    // Верхняя наклонная линия
    const angle = 0.1 + (Math.random() - 0.5) * 0.2;
    drawLine(field, centerX - width * 0.15, height * 0.3, centerX, height * 0.2);
    
    // Нижняя горизонтальная линия
    drawLine(field, centerX - width * 0.1, height * 0.8, centerX + width * 0.1, height * 0.8);
    
    variations.push(field.flat());
  }
  
  return variations;
};

// Генерация множественных вариаций цифры 2
const generateDigit2Variations = (width, height) => {
  const variations = [];
  
  for (let i = 0; i < 3; i++) {
    const field = createEmptyField(width, height);
    const offset = (Math.random() - 0.5) * 2;
    
    // Верхняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.2, width * 0.8 + offset, height * 0.2);
    
    // Правая вертикальная линия (верхняя часть)
    drawLine(field, width * 0.8 + offset, height * 0.2, width * 0.8 + offset, height * 0.5);
    
    // Средняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.5, width * 0.8 + offset, height * 0.5);
    
    // Левая вертикальная линия (нижняя часть)
    drawLine(field, width * 0.2 + offset, height * 0.5, width * 0.2 + offset, height * 0.8);
    
    // Нижняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.8, width * 0.8 + offset, height * 0.8);
    
    variations.push(field.flat());
  }
  
  return variations;
};

// Генерация множественных вариаций цифры 3
const generateDigit3Variations = (width, height) => {
  const variations = [];
  
  for (let i = 0; i < 3; i++) {
    const field = createEmptyField(width, height);
    const offset = (Math.random() - 0.5) * 2;
    
    // Верхняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.2, width * 0.8 + offset, height * 0.2);
    
    // Средняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.5, width * 0.8 + offset, height * 0.5);
    
    // Нижняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.8, width * 0.8 + offset, height * 0.8);
    
    // Правая вертикальная линия
    drawLine(field, width * 0.8 + offset, height * 0.2, width * 0.8 + offset, height * 0.8);
    
    variations.push(field.flat());
  }
  
  return variations;
};

// Генерация множественных вариаций цифры 4
const generateDigit4Variations = (width, height) => {
  const variations = [];
  
  for (let i = 0; i < 3; i++) {
    const field = createEmptyField(width, height);
    const offset = (Math.random() - 0.5) * 2;
    
    // Левая вертикальная линия (верхняя часть)
    drawLine(field, width * 0.2 + offset, height * 0.2, width * 0.2 + offset, height * 0.5);
    
    // Средняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.5, width * 0.8 + offset, height * 0.5);
    
    // Правая вертикальная линия
    drawLine(field, width * 0.8 + offset, height * 0.2, width * 0.8 + offset, height * 0.8);
    
    variations.push(field.flat());
  }
  
  return variations;
};

// Генерация множественных вариаций цифры 5
const generateDigit5Variations = (width, height) => {
  const variations = [];
  
  for (let i = 0; i < 3; i++) {
    const field = createEmptyField(width, height);
    const offset = (Math.random() - 0.5) * 2;
    
    // Верхняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.2, width * 0.8 + offset, height * 0.2);
    
    // Левая вертикальная линия (верхняя часть)
    drawLine(field, width * 0.2 + offset, height * 0.2, width * 0.2 + offset, height * 0.5);
    
    // Средняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.5, width * 0.8 + offset, height * 0.5);
    
    // Правая вертикальная линия (нижняя часть)
    drawLine(field, width * 0.8 + offset, height * 0.5, width * 0.8 + offset, height * 0.8);
    
    // Нижняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.8, width * 0.8 + offset, height * 0.8);
    
    variations.push(field.flat());
  }
  
  return variations;
};

// Генерация множественных вариаций цифры 6
const generateDigit6Variations = (width, height) => {
  const variations = [];
  
  for (let i = 0; i < 3; i++) {
    const field = createEmptyField(width, height);
    const offset = (Math.random() - 0.5) * 2;
    
    // Верхняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.2, width * 0.8 + offset, height * 0.2);
    
    // Левая вертикальная линия
    drawLine(field, width * 0.2 + offset, height * 0.2, width * 0.2 + offset, height * 0.8);
    
    // Средняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.5, width * 0.8 + offset, height * 0.5);
    
    // Правая вертикальная линия (нижняя часть)
    drawLine(field, width * 0.8 + offset, height * 0.5, width * 0.8 + offset, height * 0.8);
    
    // Нижняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.8, width * 0.8 + offset, height * 0.8);
    
    variations.push(field.flat());
  }
  
  return variations;
};

// Генерация множественных вариаций цифры 7
const generateDigit7Variations = (width, height) => {
  const variations = [];
  
  for (let i = 0; i < 3; i++) {
    const field = createEmptyField(width, height);
    const offset = (Math.random() - 0.5) * 2;
    
    // Верхняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.2, width * 0.8 + offset, height * 0.2);
    
    // Правая вертикальная линия
    drawLine(field, width * 0.8 + offset, height * 0.2, width * 0.8 + offset, height * 0.8);
    
    variations.push(field.flat());
  }
  
  return variations;
};

// Генерация множественных вариаций цифры 8
const generateDigit8Variations = (width, height) => {
  const variations = [];
  
  for (let i = 0; i < 3; i++) {
    const field = createEmptyField(width, height);
    const offset = (Math.random() - 0.5) * 2;
    
    // Верхняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.2, width * 0.8 + offset, height * 0.2);
    
    // Средняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.5, width * 0.8 + offset, height * 0.5);
    
    // Нижняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.8, width * 0.8 + offset, height * 0.8);
    
    // Левая вертикальная линия
    drawLine(field, width * 0.2 + offset, height * 0.2, width * 0.2 + offset, height * 0.8);
    
    // Правая вертикальная линия
    drawLine(field, width * 0.8 + offset, height * 0.2, width * 0.8 + offset, height * 0.8);
    
    variations.push(field.flat());
  }
  
  return variations;
};

// Генерация множественных вариаций цифры 9
const generateDigit9Variations = (width, height) => {
  const variations = [];
  
  for (let i = 0; i < 3; i++) {
    const field = createEmptyField(width, height);
    const offset = (Math.random() - 0.5) * 2;
    
    // Верхняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.2, width * 0.8 + offset, height * 0.2);
    
    // Средняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.5, width * 0.8 + offset, height * 0.5);
    
    // Нижняя горизонтальная линия
    drawLine(field, width * 0.2 + offset, height * 0.8, width * 0.8 + offset, height * 0.8);
    
    // Левая вертикальная линия (верхняя часть)
    drawLine(field, width * 0.2 + offset, height * 0.2, width * 0.2 + offset, height * 0.5);
    
    // Правая вертикальная линия
    drawLine(field, width * 0.8 + offset, height * 0.2, width * 0.8 + offset, height * 0.8);
    
    variations.push(field.flat());
  }
  
  return variations;
};

// Создание всех вариаций
const generateAllVariations = (width, height) => {
  const allVariations = {};
  
  allVariations[0] = generateDigit0Variations(width, height);
  allVariations[1] = generateDigit1Variations(width, height);
  allVariations[2] = generateDigit2Variations(width, height);
  allVariations[3] = generateDigit3Variations(width, height);
  allVariations[4] = generateDigit4Variations(width, height);
  allVariations[5] = generateDigit5Variations(width, height);
  allVariations[6] = generateDigit6Variations(width, height);
  allVariations[7] = generateDigit7Variations(width, height);
  allVariations[8] = generateDigit8Variations(width, height);
  allVariations[9] = generateDigit9Variations(width, height);
  
  return allVariations;
};

// Качественное обучение
const trainQualityModel = (width, height) => {
  const totalPixels = width * height;
  const allVariations = generateAllVariations(width, height);
  
  // Инициализация весов
  const weights = {};
  const biases = {};
  
  for (let digit = 0; digit <= 9; digit++) {
    weights[digit] = new Array(totalPixels).fill(0).map(() => (Math.random() - 0.5) * 0.01);
    biases[digit] = (Math.random() - 0.5) * 0.01;
  }
  
  // Обучение на всех вариациях
  const learningRate = 0.01;
  const epochs = 2;
  
  console.log('🚀 Начинаем качественное обучение...');
  console.log(`📊 Вариаций на цифру: 3`);
  console.log(`📈 Всего примеров: ${Object.keys(allVariations).length * 3}`);
  
  for (let epoch = 0; epoch < epochs; epoch++) {
    let totalError = 0;
    
    for (let digit = 0; digit <= 9; digit++) {
      const variations = allVariations[digit];
      
      for (const pattern of variations) {
        // Обновляем веса для всех цифр
        for (let d = 0; d <= 9; d++) {
          let sum = biases[d];
          for (let i = 0; i < totalPixels; i++) {
            sum += pattern[i] * weights[d][i];
          }
          
          const prediction = sigmoid(sum);
          const target = d === digit ? 1 : 0;
          const error = target - prediction;
          totalError += Math.abs(error);
          
          // Обновляем веса
          for (let i = 0; i < totalPixels; i++) {
            weights[d][i] += error * pattern[i] * learningRate;
          }
          biases[d] += error * learningRate;
        }
      }
    }
    
    console.log(`Эпоха ${epoch + 1}: Средняя ошибка = ${(totalError / (50 * 10)).toFixed(4)}`);
  }
  
  console.log('✅ Качественное обучение завершено!');
  return { weights, biases };
};

// Создание качественной модели
console.log('🎯 Создание качественной модели с множественными вариациями...');
const { weights, biases } = trainQualityModel(30, 30);

const model = {
  weights: weights,
  biases: biases,
  metadata: {
    version: "1.0",
    created: new Date().toISOString().split('T')[0],
    canvasSize: 30,
    totalPixels: 900,
    description: "Быстрая модель с 3 вариациями каждой цифры",
    trainingEpochs: 2,
    learningRate: 0.01,
    trainingExamples: 30,
    variationsPerDigit: 3
  }
};

// Сохранение в папку public/models с уникальным именем
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const modelName = `model-${timestamp}`;
const modelPath = path.join(__dirname, 'public', 'models', `${modelName}.json`);
fs.writeFileSync(modelPath, JSON.stringify(model, null, 2));

// Обновляем список моделей
const modelsListPath = path.join(__dirname, 'public', 'models', 'models.json');
let modelsList = { models: [] };

if (fs.existsSync(modelsListPath)) {
  try {
    const content = fs.readFileSync(modelsListPath, 'utf8');
    modelsList = JSON.parse(content);
  } catch (error) {
    console.log('Создаем новый список моделей');
  }
}

// Добавляем новую модель в список
modelsList.models.push({
  name: modelName,
  type: 'advanced',
  description: model.metadata.description
});

fs.writeFileSync(modelsListPath, JSON.stringify(modelsList, null, 2));

console.log('✅ Качественная модель создана и сохранена!');
console.log(`📊 Размер: ${Object.keys(model.weights).length} цифр × ${model.weights[0].length} пикселей`);
console.log(`🎨 Вариаций на цифру: ${model.metadata.variationsPerDigit}`);
console.log(`📈 Эпох обучения: ${model.metadata.trainingEpochs}`);
console.log(`💾 Файл: ${modelPath}`);
console.log(`🏷️  Название модели: ${modelName}`);
console.log(`📋 Список моделей обновлен`);
