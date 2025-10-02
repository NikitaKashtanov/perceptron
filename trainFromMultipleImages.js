// Обучение нейросети на множественных реалистичных изображениях цифр

const fs = require('fs');
const path = require('path');

// Простая сигмоидальная функция
const sigmoid = (x) => {
  x = Math.max(-10, Math.min(10, x));
  return 1 / (1 + Math.exp(-x));
};

// Создание множественных вариаций реалистичных паттернов цифр
const createMultipleRealisticDigitPatterns = () => {
  const patterns = {};
  const size = 30;
  const variationsPerDigit = 10;
  
  // Создаем множественные вариации для каждой цифры
  for (let digit = 0; digit <= 9; digit++) {
    patterns[digit] = [];
    
    for (let variation = 0; variation < variationsPerDigit; variation++) {
      const field = Array(size).fill().map(() => Array(size).fill(0));
      
      // Добавляем случайные вариации (сдвиги, искажения)
      const offsetX = (Math.random() - 0.5) * 2;
      const offsetY = (Math.random() - 0.5) * 2;
      const scale = 0.9 + Math.random() * 0.2; // От 0.9 до 1.1
      
      switch(digit) {
        case 0: // Окружность с вариациями
          const centerX = size / 2 + offsetX;
          const centerY = size / 2 + offsetY;
          const radius = size * 0.35 * scale;
          for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
              const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
              if (dist <= radius && dist >= radius * 0.6) {
                field[y][x] = 1;
              }
            }
          }
          break;
          
        case 1: // Вертикальная линия с вариациями
          const midX = Math.floor(size * 0.5) + offsetX;
          for (let y = Math.floor(size * 0.15); y < Math.floor(size * 0.85); y++) {
            const x = midX + Math.floor((y - size * 0.5) * 0.1 * scale);
            if (x >= 0 && x < size) field[y][x] = 1;
          }
          // Горизонтальная линия сверху
          for (let x = Math.floor(size * 0.4); x < Math.floor(size * 0.6); x++) {
            field[Math.floor(size * 0.2)][x] = 1;
          }
          break;
          
        case 2: // Форма двойки с вариациями
          const base2 = size * 0.2 + offsetX;
          const top2 = size * 0.2 + offsetY;
          const mid2 = size * 0.5 + offsetY;
          const bottom2 = size * 0.8 + offsetY;
          const right2 = size * 0.8 + offsetX;
          
          // Верхняя горизонтальная
          for (let x = Math.floor(base2); x < Math.floor(right2); x++) {
            if (x >= 0 && x < size) field[Math.floor(top2)][x] = 1;
          }
          // Правая вертикальная (верхняя часть)
          for (let y = Math.floor(top2); y < Math.floor(mid2); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(right2)] = 1;
          }
          // Средняя горизонтальная
          for (let x = Math.floor(base2); x < Math.floor(right2); x++) {
            if (x >= 0 && x < size) field[Math.floor(mid2)][x] = 1;
          }
          // Левая вертикальная (нижняя часть)
          for (let y = Math.floor(mid2); y < Math.floor(bottom2); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(base2)] = 1;
          }
          // Нижняя горизонтальная
          for (let x = Math.floor(base2); x < Math.floor(right2); x++) {
            if (x >= 0 && x < size) field[Math.floor(bottom2)][x] = 1;
          }
          break;
          
        case 3: // Форма тройки с вариациями
          const base3 = size * 0.2 + offsetX;
          const top3 = size * 0.2 + offsetY;
          const mid3 = size * 0.5 + offsetY;
          const bottom3 = size * 0.8 + offsetY;
          const right3 = size * 0.8 + offsetX;
          
          // Верхняя горизонтальная
          for (let x = Math.floor(base3); x < Math.floor(right3); x++) {
            if (x >= 0 && x < size) field[Math.floor(top3)][x] = 1;
          }
          // Правая вертикальная
          for (let y = Math.floor(top3); y < Math.floor(bottom3); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(right3)] = 1;
          }
          // Средняя горизонтальная
          for (let x = Math.floor(base3); x < Math.floor(right3); x++) {
            if (x >= 0 && x < size) field[Math.floor(mid3)][x] = 1;
          }
          // Нижняя горизонтальная
          for (let x = Math.floor(base3); x < Math.floor(right3); x++) {
            if (x >= 0 && x < size) field[Math.floor(bottom3)][x] = 1;
          }
          break;
          
        case 4: // Форма четверки с вариациями
          const base4 = size * 0.2 + offsetX;
          const mid4 = size * 0.5 + offsetY;
          const right4 = size * 0.8 + offsetX;
          
          // Левая вертикальная (верхняя часть)
          for (let y = Math.floor(size * 0.2); y < Math.floor(mid4); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(base4)] = 1;
          }
          // Средняя горизонтальная
          for (let x = Math.floor(base4); x < Math.floor(right4); x++) {
            if (x >= 0 && x < size) field[Math.floor(mid4)][x] = 1;
          }
          // Правая вертикальная
          for (let y = Math.floor(size * 0.2); y < Math.floor(size * 0.8); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(right4)] = 1;
          }
          break;
          
        case 5: // Форма пятерки с вариациями
          const base5 = size * 0.2 + offsetX;
          const top5 = size * 0.2 + offsetY;
          const mid5 = size * 0.5 + offsetY;
          const bottom5 = size * 0.8 + offsetY;
          const right5 = size * 0.8 + offsetX;
          
          // Верхняя горизонтальная
          for (let x = Math.floor(base5); x < Math.floor(right5); x++) {
            if (x >= 0 && x < size) field[Math.floor(top5)][x] = 1;
          }
          // Левая вертикальная (верхняя часть)
          for (let y = Math.floor(top5); y < Math.floor(mid5); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(base5)] = 1;
          }
          // Средняя горизонтальная
          for (let x = Math.floor(base5); x < Math.floor(right5); x++) {
            if (x >= 0 && x < size) field[Math.floor(mid5)][x] = 1;
          }
          // Правая вертикальная (нижняя часть)
          for (let y = Math.floor(mid5); y < Math.floor(bottom5); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(right5)] = 1;
          }
          // Нижняя горизонтальная
          for (let x = Math.floor(base5); x < Math.floor(right5); x++) {
            if (x >= 0 && x < size) field[Math.floor(bottom5)][x] = 1;
          }
          break;
          
        case 6: // Форма шестерки с вариациями
          const base6 = size * 0.2 + offsetX;
          const top6 = size * 0.2 + offsetY;
          const mid6 = size * 0.5 + offsetY;
          const bottom6 = size * 0.8 + offsetY;
          const right6 = size * 0.8 + offsetX;
          
          // Верхняя горизонтальная
          for (let x = Math.floor(base6); x < Math.floor(right6); x++) {
            if (x >= 0 && x < size) field[Math.floor(top6)][x] = 1;
          }
          // Левая вертикальная
          for (let y = Math.floor(top6); y < Math.floor(bottom6); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(base6)] = 1;
          }
          // Средняя горизонтальная
          for (let x = Math.floor(base6); x < Math.floor(right6); x++) {
            if (x >= 0 && x < size) field[Math.floor(mid6)][x] = 1;
          }
          // Правая вертикальная (нижняя часть)
          for (let y = Math.floor(mid6); y < Math.floor(bottom6); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(right6)] = 1;
          }
          // Нижняя горизонтальная
          for (let x = Math.floor(base6); x < Math.floor(right6); x++) {
            if (x >= 0 && x < size) field[Math.floor(bottom6)][x] = 1;
          }
          break;
          
        case 7: // Форма семерки с вариациями
          const base7 = size * 0.2 + offsetX;
          const top7 = size * 0.2 + offsetY;
          const right7 = size * 0.8 + offsetX;
          
          // Верхняя горизонтальная
          for (let x = Math.floor(base7); x < Math.floor(right7); x++) {
            if (x >= 0 && x < size) field[Math.floor(top7)][x] = 1;
          }
          // Правая вертикальная
          for (let y = Math.floor(top7); y < Math.floor(size * 0.8); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(right7)] = 1;
          }
          break;
          
        case 8: // Форма восьмерки с вариациями
          const base8 = size * 0.2 + offsetX;
          const top8 = size * 0.2 + offsetY;
          const mid8 = size * 0.5 + offsetY;
          const bottom8 = size * 0.8 + offsetY;
          const right8 = size * 0.8 + offsetX;
          
          // Верхняя горизонтальная
          for (let x = Math.floor(base8); x < Math.floor(right8); x++) {
            if (x >= 0 && x < size) field[Math.floor(top8)][x] = 1;
          }
          // Средняя горизонтальная
          for (let x = Math.floor(base8); x < Math.floor(right8); x++) {
            if (x >= 0 && x < size) field[Math.floor(mid8)][x] = 1;
          }
          // Нижняя горизонтальная
          for (let x = Math.floor(base8); x < Math.floor(right8); x++) {
            if (x >= 0 && x < size) field[Math.floor(bottom8)][x] = 1;
          }
          // Левая вертикальная
          for (let y = Math.floor(top8); y < Math.floor(bottom8); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(base8)] = 1;
          }
          // Правая вертикальная
          for (let y = Math.floor(top8); y < Math.floor(bottom8); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(right8)] = 1;
          }
          break;
          
        case 9: // Форма девятки с вариациями
          const base9 = size * 0.2 + offsetX;
          const top9 = size * 0.2 + offsetY;
          const mid9 = size * 0.5 + offsetY;
          const bottom9 = size * 0.8 + offsetY;
          const right9 = size * 0.8 + offsetX;
          
          // Верхняя горизонтальная
          for (let x = Math.floor(base9); x < Math.floor(right9); x++) {
            if (x >= 0 && x < size) field[Math.floor(top9)][x] = 1;
          }
          // Средняя горизонтальная
          for (let x = Math.floor(base9); x < Math.floor(right9); x++) {
            if (x >= 0 && x < size) field[Math.floor(mid9)][x] = 1;
          }
          // Нижняя горизонтальная
          for (let x = Math.floor(base9); x < Math.floor(right9); x++) {
            if (x >= 0 && x < size) field[Math.floor(bottom9)][x] = 1;
          }
          // Левая вертикальная (верхняя часть)
          for (let y = Math.floor(top9); y < Math.floor(mid9); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(base9)] = 1;
          }
          // Правая вертикальная
          for (let y = Math.floor(top9); y < Math.floor(bottom9); y++) {
            if (y >= 0 && y < size) field[y][Math.floor(right9)] = 1;
          }
          break;
      }
      
      // Конвертируем в плоский массив
      patterns[digit].push(field.flat());
    }
  }
  
  return patterns;
};

// Обучение нейросети на множественных примерах
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
  const epochs = 8; // Увеличили количество эпох
  
  console.log('🚀 Начинаем обучение на множественных реалистичных изображениях...');
  console.log(`📊 Размер канваса: ${canvasSize}x${canvasSize}`);
  console.log(`📈 Эпох обучения: ${epochs}`);
  console.log(`🎨 Вариаций на цифру: 10`);
  console.log(`📋 Всего примеров: ${Object.keys(patterns).length * 10}`);
  
  for (let epoch = 0; epoch < epochs; epoch++) {
    let totalError = 0;
    let processedExamples = 0;
    
    for (let digit = 0; digit <= 9; digit++) {
      const variations = patterns[digit];
      
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
          biases[d] += learningRate * error;
          for (let i = 0; i < totalPixels; i++) {
            weights[d][i] += learningRate * error * pattern[i];
          }
        }
        processedExamples++;
      }
    }
    
    const avgError = totalError / processedExamples;
    console.log(`Эпоха ${epoch + 1}/${epochs}, Ошибка: ${totalError.toFixed(4)} (средняя: ${avgError.toFixed(4)})`);
  }
  
  return { weights, biases };
};

// Основная функция
const main = async () => {
  console.log('🎯 Создание модели на основе множественных реалистичных изображений цифр...');
  
  try {
    // Создаем множественные реалистичные паттерны цифр
    const patterns = createMultipleRealisticDigitPatterns();
    console.log('✅ Множественные реалистичные паттерны цифр созданы');
    
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
        description: "Модель обучена на множественных реалистичных изображениях (10 вариаций на цифру)",
        trainingEpochs: 8,
        learningRate: 0.01,
        trainingExamples: 100,
        variationsPerDigit: 10
      }
    };
    
    // Копируем веса и смещения
    for (let digit = 0; digit <= 9; digit++) {
      model.weights[digit.toString()] = weights[digit];
      model.biases[digit.toString()] = biases[digit];
    }
    
    // Сохранение в папку public/models с уникальным именем
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const modelName = `multi-realistic-model-${timestamp}`;
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
      type: 'multi-realistic',
      description: model.metadata.description
    });
    
    fs.writeFileSync(modelsListPath, JSON.stringify(modelsList, null, 2));
    
    console.log('✅ Множественная реалистичная модель создана и сохранена!');
    console.log(`📊 Размер: ${Object.keys(model.weights).length} цифр × ${model.weights[0].length} пикселей`);
    console.log(`🎨 Вариаций на цифру: ${model.metadata.variationsPerDigit}`);
    console.log(`📈 Эпох обучения: ${model.metadata.trainingEpochs}`);
    console.log(`📋 Всего примеров: ${model.metadata.trainingExamples}`);
    console.log(`📁 Файл: ${modelPath}`);
    console.log(`🏷️  Название модели: ${modelName}`);
    console.log(`📋 Список моделей обновлен`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
};

// Запуск
main();
