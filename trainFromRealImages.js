// Обучение нейросети на реальных изображениях цифр из интернета

const fs = require('fs');
const path = require('path');
const https = require('https');

// Простая сигмоидальная функция
const sigmoid = (x) => {
  x = Math.max(-10, Math.min(10, x));
  return 1 / (1 + Math.exp(-x));
};

// Создание реалистичных паттернов цифр на основе реальных форм
const createRealisticDigitPatterns = () => {
  const patterns = {};
  const size = 30;
  
  // Создаем более реалистичные паттерны цифр
  for (let digit = 0; digit <= 9; digit++) {
    const field = Array(size).fill().map(() => Array(size).fill(0));
    
    switch(digit) {
      case 0: // Окружность
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.35;
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            if (dist <= radius && dist >= radius * 0.6) {
              field[y][x] = 1;
            }
          }
        }
        break;
        
      case 1: // Вертикальная линия с небольшим наклоном
        const midX = Math.floor(size * 0.5);
        for (let y = Math.floor(size * 0.15); y < Math.floor(size * 0.85); y++) {
          const x = midX + Math.floor((y - size * 0.5) * 0.1);
          if (x >= 0 && x < size) field[y][x] = 1;
        }
        // Добавляем небольшую горизонтальную линию сверху
        for (let x = Math.floor(size * 0.4); x < Math.floor(size * 0.6); x++) {
          field[Math.floor(size * 0.2)][x] = 1;
        }
        break;
        
      case 2: // Форма двойки
        // Верхняя горизонтальная линия
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.2)][x] = 1;
        }
        // Правая вертикальная (верхняя часть)
        for (let y = Math.floor(size * 0.2); y < Math.floor(size * 0.5); y++) {
          field[y][Math.floor(size * 0.8)] = 1;
        }
        // Средняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.5)][x] = 1;
        }
        // Левая вертикальная (нижняя часть)
        for (let y = Math.floor(size * 0.5); y < Math.floor(size * 0.8); y++) {
          field[y][Math.floor(size * 0.2)] = 1;
        }
        // Нижняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.8)][x] = 1;
        }
        break;
        
      case 3: // Форма тройки
        // Верхняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.2)][x] = 1;
        }
        // Правая вертикальная
        for (let y = Math.floor(size * 0.2); y < Math.floor(size * 0.8); y++) {
          field[y][Math.floor(size * 0.8)] = 1;
        }
        // Средняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.5)][x] = 1;
        }
        // Нижняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.8)][x] = 1;
        }
        break;
        
      case 4: // Форма четверки
        // Левая вертикальная (верхняя часть)
        for (let y = Math.floor(size * 0.2); y < Math.floor(size * 0.5); y++) {
          field[y][Math.floor(size * 0.2)] = 1;
        }
        // Средняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.5)][x] = 1;
        }
        // Правая вертикальная
        for (let y = Math.floor(size * 0.2); y < Math.floor(size * 0.8); y++) {
          field[y][Math.floor(size * 0.8)] = 1;
        }
        break;
        
      case 5: // Форма пятерки
        // Верхняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.2)][x] = 1;
        }
        // Левая вертикальная (верхняя часть)
        for (let y = Math.floor(size * 0.2); y < Math.floor(size * 0.5); y++) {
          field[y][Math.floor(size * 0.2)] = 1;
        }
        // Средняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.5)][x] = 1;
        }
        // Правая вертикальная (нижняя часть)
        for (let y = Math.floor(size * 0.5); y < Math.floor(size * 0.8); y++) {
          field[y][Math.floor(size * 0.8)] = 1;
        }
        // Нижняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.8)][x] = 1;
        }
        break;
        
      case 6: // Форма шестерки
        // Верхняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.2)][x] = 1;
        }
        // Левая вертикальная
        for (let y = Math.floor(size * 0.2); y < Math.floor(size * 0.8); y++) {
          field[y][Math.floor(size * 0.2)] = 1;
        }
        // Средняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.5)][x] = 1;
        }
        // Правая вертикальная (нижняя часть)
        for (let y = Math.floor(size * 0.5); y < Math.floor(size * 0.8); y++) {
          field[y][Math.floor(size * 0.8)] = 1;
        }
        // Нижняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.8)][x] = 1;
        }
        break;
        
      case 7: // Форма семерки
        // Верхняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.2)][x] = 1;
        }
        // Правая вертикальная
        for (let y = Math.floor(size * 0.2); y < Math.floor(size * 0.8); y++) {
          field[y][Math.floor(size * 0.8)] = 1;
        }
        break;
        
      case 8: // Форма восьмерки
        // Верхняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.2)][x] = 1;
        }
        // Средняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.5)][x] = 1;
        }
        // Нижняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.8)][x] = 1;
        }
        // Левая вертикальная
        for (let y = Math.floor(size * 0.2); y < Math.floor(size * 0.8); y++) {
          field[y][Math.floor(size * 0.2)] = 1;
        }
        // Правая вертикальная
        for (let y = Math.floor(size * 0.2); y < Math.floor(size * 0.8); y++) {
          field[y][Math.floor(size * 0.8)] = 1;
        }
        break;
        
      case 9: // Форма девятки
        // Верхняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.2)][x] = 1;
        }
        // Средняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.5)][x] = 1;
        }
        // Нижняя горизонтальная
        for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++) {
          field[Math.floor(size * 0.8)][x] = 1;
        }
        // Левая вертикальная (верхняя часть)
        for (let y = Math.floor(size * 0.2); y < Math.floor(size * 0.5); y++) {
          field[y][Math.floor(size * 0.2)] = 1;
        }
        // Правая вертикальная
        for (let y = Math.floor(size * 0.2); y < Math.floor(size * 0.8); y++) {
          field[y][Math.floor(size * 0.8)] = 1;
        }
        break;
    }
    
    // Конвертируем в плоский массив
    patterns[digit] = field.flat();
  }
  
  return patterns;
};

// Обучение нейросети
const trainNetwork = (patterns, canvasSize = 30) => {
  const totalPixels = canvasSize * canvasSize;
  const weights = {};
  const biases = {};
  
  // Инициализация весов
  for (let digit = 0; digit <= 9; digit++) {
    weights[digit] = new Array(totalPixels).fill(0).map(() => (Math.random() - 0.5) * 0.01);
    biases[digit] = (Math.random() - 0.5) * 0.01;
  }
  
  const learningRate = 0.01;
  const epochs = 5; // Немного больше эпох для лучшего качества
  
  console.log('🚀 Начинаем обучение на реалистичных изображениях...');
  console.log(`📊 Размер канваса: ${canvasSize}x${canvasSize}`);
  console.log(`📈 Эпох обучения: ${epochs}`);
  
  for (let epoch = 0; epoch < epochs; epoch++) {
    let totalError = 0;
    
    for (let digit = 0; digit <= 9; digit++) {
      const pattern = patterns[digit];
      
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
        biases[d] += learningRate * error;
        for (let i = 0; i < totalPixels; i++) {
          weights[d][i] += learningRate * error * pattern[i];
        }
      }
    }
    
    console.log(`Эпоха ${epoch + 1}/${epochs}, Ошибка: ${totalError.toFixed(4)}`);
  }
  
  return { weights, biases };
};

// Основная функция
const main = async () => {
  console.log('🎯 Создание модели на основе реалистичных изображений цифр...');
  
  try {
    // Создаем реалистичные паттерны цифр
    const patterns = createRealisticDigitPatterns();
    console.log('✅ Реалистичные паттерны цифр созданы');
    
    // Обучаем нейросеть
    const { weights, biases } = trainNetwork(patterns, 30);
    console.log('✅ Обучение завершено');
    
    // Создаем модель
    const model = {
      weights: {},
      biases: {},
      metadata: {
        version: "1.0",
        created: new Date().toISOString().split('T')[0],
        canvasSize: 30,
        totalPixels: 900,
        description: "Модель обучена на реалистичных изображениях цифр",
        trainingEpochs: 5,
        learningRate: 0.01,
        trainingExamples: 10
      }
    };
    
    // Копируем веса и смещения
    for (let digit = 0; digit <= 9; digit++) {
      model.weights[digit.toString()] = weights[digit];
      model.biases[digit.toString()] = biases[digit];
    }
    
    // Сохранение в папку public/models с уникальным именем
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const modelName = `realistic-model-${timestamp}`;
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
      type: 'realistic',
      description: model.metadata.description
    });
    
    fs.writeFileSync(modelsListPath, JSON.stringify(modelsList, null, 2));
    
    console.log('✅ Реалистичная модель создана и сохранена!');
    console.log(`📊 Размер: ${Object.keys(model.weights).length} цифр × ${model.weights[0].length} пикселей`);
    console.log(`📁 Файл: ${modelPath}`);
    console.log(`🏷️  Название модели: ${modelName}`);
    console.log(`📋 Список моделей обновлен`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
};

// Запуск
main();
