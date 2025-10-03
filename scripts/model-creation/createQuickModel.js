// Быстрое создание предобученной модели

const fs = require('fs');
const path = require('path');

// Простая сигмоидальная функция
const sigmoid = (x) => {
  x = Math.max(-10, Math.min(10, x));
  return 1 / (1 + Math.exp(-x));
};

// Создание простых паттернов цифр
const createDigitPattern = (digit, width, height) => {
  const field = Array(height).fill().map(() => Array(width).fill(0));
  
  switch(digit) {
    case 0: // Окружность
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.3;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          if (Math.abs(dist - radius) <= 1) field[y][x] = 1;
        }
      }
      break;
      
    case 1: // Вертикальная линия
      const midX = Math.floor(width / 2);
      for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.8); y++) {
        field[y][midX] = 1;
      }
      break;
      
    case 2: // Простая форма
      for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x++) {
        field[Math.floor(height * 0.2)][x] = 1; // верх
        field[Math.floor(height * 0.5)][x] = 1; // середина
        field[Math.floor(height * 0.8)][x] = 1; // низ
      }
      for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.5); y++) {
        field[y][Math.floor(width * 0.8)] = 1; // правая верхняя
      }
      for (let y = Math.floor(height * 0.5); y < Math.floor(height * 0.8); y++) {
        field[y][Math.floor(width * 0.2)] = 1; // левая нижняя
      }
      break;
      
    case 3: // Три горизонтальные линии + правая вертикальная
      for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x++) {
        field[Math.floor(height * 0.2)][x] = 1;
        field[Math.floor(height * 0.5)][x] = 1;
        field[Math.floor(height * 0.8)][x] = 1;
      }
      for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.8); y++) {
        field[y][Math.floor(width * 0.8)] = 1;
      }
      break;
      
    case 4: // Левая верхняя + средняя горизонтальная + правая вертикальная
      for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.5); y++) {
        field[y][Math.floor(width * 0.2)] = 1;
      }
      for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x++) {
        field[Math.floor(height * 0.5)][x] = 1;
      }
      for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.8); y++) {
        field[y][Math.floor(width * 0.8)] = 1;
      }
      break;
      
    case 5: // Как 2, но с правой нижней частью
      for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x++) {
        field[Math.floor(height * 0.2)][x] = 1;
        field[Math.floor(height * 0.5)][x] = 1;
        field[Math.floor(height * 0.8)][x] = 1;
      }
      for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.5); y++) {
        field[y][Math.floor(width * 0.2)] = 1;
      }
      for (let y = Math.floor(height * 0.5); y < Math.floor(height * 0.8); y++) {
        field[y][Math.floor(width * 0.8)] = 1;
      }
      break;
      
    case 6: // Как 5, но с левой нижней частью
      for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x++) {
        field[Math.floor(height * 0.2)][x] = 1;
        field[Math.floor(height * 0.5)][x] = 1;
        field[Math.floor(height * 0.8)][x] = 1;
      }
      for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.8); y++) {
        field[y][Math.floor(width * 0.2)] = 1;
      }
      for (let y = Math.floor(height * 0.5); y < Math.floor(height * 0.8); y++) {
        field[y][Math.floor(width * 0.8)] = 1;
      }
      break;
      
    case 7: // Верхняя горизонтальная + правая вертикальная
      for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x++) {
        field[Math.floor(height * 0.2)][x] = 1;
      }
      for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.8); y++) {
        field[y][Math.floor(width * 0.8)] = 1;
      }
      break;
      
    case 8: // Все линии
      for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x++) {
        field[Math.floor(height * 0.2)][x] = 1;
        field[Math.floor(height * 0.5)][x] = 1;
        field[Math.floor(height * 0.8)][x] = 1;
      }
      for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.8); y++) {
        field[y][Math.floor(width * 0.2)] = 1;
        field[y][Math.floor(width * 0.8)] = 1;
      }
      break;
      
    case 9: // Как 8, но без левой нижней части
      for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x++) {
        field[Math.floor(height * 0.2)][x] = 1;
        field[Math.floor(height * 0.5)][x] = 1;
        field[Math.floor(height * 0.8)][x] = 1;
      }
      for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.5); y++) {
        field[y][Math.floor(width * 0.2)] = 1;
      }
      for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.8); y++) {
        field[y][Math.floor(width * 0.8)] = 1;
      }
      break;
  }
  
  return field.flat();
};

// Быстрое обучение
const quickTrain = (width, height) => {
  const totalPixels = width * height;
  const weights = {};
  const biases = {};
  
  // Инициализация
  for (let digit = 0; digit <= 9; digit++) {
    weights[digit] = new Array(totalPixels).fill(0);
    biases[digit] = 0;
  }
  
  // Простое обучение - только 5 эпох
  for (let epoch = 0; epoch < 5; epoch++) {
    for (let digit = 0; digit <= 9; digit++) {
      const pattern = createDigitPattern(digit, width, height);
      
      // Обновляем веса для всех цифр
      for (let d = 0; d <= 9; d++) {
        const target = d === digit ? 1 : 0;
        
        for (let i = 0; i < totalPixels; i++) {
          const weight = weights[d][i];
          const pixel = pattern[i];
          const prediction = sigmoid(weight * pixel + biases[d]);
          const error = target - prediction;
          
          weights[d][i] += error * pixel * 0.1;
        }
        biases[d] += (target - sigmoid(biases[d])) * 0.1;
      }
    }
    console.log(`Эпоха ${epoch + 1} завершена`);
  }
  
  return { weights, biases };
};

// Создание модели
console.log('🚀 Создание быстрой модели...');
const { weights, biases } = quickTrain(30, 30);

const model = {
  weights: weights,
  biases: biases,
  metadata: {
    version: "1.0",
    created: new Date().toISOString().split('T')[0],
    canvasSize: 30,
    totalPixels: 900,
    description: "Быстрая предобученная модель для распознавания цифр",
    trainingEpochs: 5,
    learningRate: 0.1,
    trainingExamples: 50
  }
};

// Сохранение
// Сохранение в папку public/models с уникальным именем
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const modelName = `quick-model-${timestamp}`;
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
  type: 'quick',
  description: 'Быстрая модель для тестирования'
});

fs.writeFileSync(modelsListPath, JSON.stringify(modelsList, null, 2));

console.log('✅ Быстрая модель создана и сохранена!');
console.log(`📊 Размер: ${Object.keys(model.weights).length} цифр × ${model.weights[0].length} пикселей`);
console.log(`📁 Файл: ${modelPath}`);
console.log(`🏷️  Название модели: ${modelName}`);
console.log(`📋 Список моделей обновлен`);
