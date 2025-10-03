// Скрипт для создания реальной предобученной модели

// Простая сигмоидальная функция
const sigmoid = (x) => {
  x = Math.max(-10, Math.min(10, x));
  return 1 / (1 + Math.exp(-x));
};

// Создание пустого поля
const createEmptyField = (width, height) => {
  return Array(height).fill().map(() => Array(width).fill(0));
};

// Рисование линии
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

// Генерация простых паттернов цифр
const generateDigitPatterns = (width, height) => {
  const patterns = {};
  
  // Цифра 0 - окружность
  patterns[0] = () => {
    const field = createEmptyField(width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        if (Math.abs(distance - radius) <= 1) {
          field[y][x] = 1;
        }
      }
    }
    return field.flat();
  };
  
  // Цифра 1 - вертикальная линия
  patterns[1] = () => {
    const field = createEmptyField(width, height);
    const centerX = width / 2;
    drawLine(field, centerX, height * 0.2, centerX, height * 0.8);
    drawLine(field, centerX - width * 0.15, height * 0.3, centerX, height * 0.2);
    drawLine(field, centerX - width * 0.1, height * 0.8, centerX + width * 0.1, height * 0.8);
    return field.flat();
  };
  
  // Цифра 2
  patterns[2] = () => {
    const field = createEmptyField(width, height);
    drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
    drawLine(field, width * 0.8, height * 0.2, width * 0.8, height * 0.5);
    drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
    drawLine(field, width * 0.2, height * 0.5, width * 0.2, height * 0.8);
    drawLine(field, width * 0.2, height * 0.8, width * 0.8, height * 0.8);
    return field.flat();
  };
  
  // Цифра 3
  patterns[3] = () => {
    const field = createEmptyField(width, height);
    drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
    drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
    drawLine(field, width * 0.2, height * 0.8, width * 0.8, height * 0.8);
    drawLine(field, width * 0.8, height * 0.2, width * 0.8, height * 0.8);
    return field.flat();
  };
  
  // Цифра 4
  patterns[4] = () => {
    const field = createEmptyField(width, height);
    drawLine(field, width * 0.2, height * 0.2, width * 0.2, height * 0.5);
    drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
    drawLine(field, width * 0.8, height * 0.2, width * 0.8, height * 0.8);
    return field.flat();
  };
  
  // Цифра 5
  patterns[5] = () => {
    const field = createEmptyField(width, height);
    drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
    drawLine(field, width * 0.2, height * 0.2, width * 0.2, height * 0.5);
    drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
    drawLine(field, width * 0.8, height * 0.5, width * 0.8, height * 0.8);
    drawLine(field, width * 0.2, height * 0.8, width * 0.8, height * 0.8);
    return field.flat();
  };
  
  // Цифра 6
  patterns[6] = () => {
    const field = createEmptyField(width, height);
    drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
    drawLine(field, width * 0.2, height * 0.2, width * 0.2, height * 0.8);
    drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
    drawLine(field, width * 0.8, height * 0.5, width * 0.8, height * 0.8);
    drawLine(field, width * 0.2, height * 0.8, width * 0.8, height * 0.8);
    return field.flat();
  };
  
  // Цифра 7
  patterns[7] = () => {
    const field = createEmptyField(width, height);
    drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
    drawLine(field, width * 0.8, height * 0.2, width * 0.8, height * 0.8);
    return field.flat();
  };
  
  // Цифра 8
  patterns[8] = () => {
    const field = createEmptyField(width, height);
    drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
    drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
    drawLine(field, width * 0.2, height * 0.8, width * 0.8, height * 0.8);
    drawLine(field, width * 0.2, height * 0.2, width * 0.2, height * 0.8);
    drawLine(field, width * 0.8, height * 0.2, width * 0.8, height * 0.8);
    return field.flat();
  };
  
  // Цифра 9
  patterns[9] = () => {
    const field = createEmptyField(width, height);
    drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
    drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
    drawLine(field, width * 0.2, height * 0.8, width * 0.8, height * 0.8);
    drawLine(field, width * 0.2, height * 0.2, width * 0.2, height * 0.5);
    drawLine(field, width * 0.8, height * 0.2, width * 0.8, height * 0.8);
    return field.flat();
  };
  
  return patterns;
};

// Простое обучение
const trainSimpleModel = (width, height) => {
  const totalPixels = width * height;
  const patterns = generateDigitPatterns(width, height);
  
  // Инициализация весов
  const weights = {};
  const biases = {};
  
  for (let digit = 0; digit <= 9; digit++) {
    weights[digit] = new Array(totalPixels).fill(0).map(() => (Math.random() - 0.5) * 0.01);
    biases[digit] = (Math.random() - 0.5) * 0.01;
  }
  
  // Обучение
  const learningRate = 0.01;
  const epochs = 50;
  
  console.log('Начинаем обучение...');
  
  for (let epoch = 0; epoch < epochs; epoch++) {
    for (let digit = 0; digit <= 9; digit++) {
      const pattern = patterns[digit]();
      
      // Обновляем веса для всех цифр
      for (let d = 0; d <= 9; d++) {
        let sum = biases[d];
        for (let i = 0; i < totalPixels; i++) {
          sum += pattern[i] * weights[d][i];
        }
        
        const prediction = sigmoid(sum);
        const target = d === digit ? 1 : 0;
        const error = target - prediction;
        
        // Обновляем веса
        for (let i = 0; i < totalPixels; i++) {
          weights[d][i] += error * pattern[i] * learningRate;
        }
        biases[d] += error * learningRate;
      }
    }
    
    if (epoch % 10 === 0) {
      console.log(`Эпоха ${epoch} завершена`);
    }
  }
  
  console.log('Обучение завершено!');
  return { weights, biases };
};

// Создание модели
const createModel = (width, height) => {
  const { weights, biases } = trainSimpleModel(width, height);
  
  return {
    weights: weights,
    biases: biases,
    metadata: {
      version: "1.0",
      created: new Date().toISOString().split('T')[0],
      canvasSize: width,
      totalPixels: width * height,
      description: "Реальная предобученная модель для распознавания цифр",
      trainingEpochs: 50,
      learningRate: 0.01,
      trainingExamples: 50
    }
  };
};

// Создаем и сохраняем модель
const model = createModel(30, 30);
const fs = require('fs');
const path = require('path');

const modelPath = path.join(__dirname, 'public', 'trainedModel.json');
fs.writeFileSync(modelPath, JSON.stringify(model, null, 2));

console.log('✅ Модель создана и сохранена в trainedModel.json');
console.log(`📊 Размер весов: ${Object.keys(model.weights).length} цифр × ${model.weights[0].length} пикселей`);
console.log(`📈 Всего весов: ${Object.keys(model.weights).length * model.weights[0].length}`);
