// Улучшенное обучение нейросети на реалистичных изображениях цифр (20x30)

const fs = require('fs');
const path = require('path');

// Простая сигмоидальная функция
const sigmoid = (x) => {
  x = Math.max(-10, Math.min(10, x));
  return 1 / (1 + Math.exp(-x));
};

// Создание улучшенных паттернов цифр для поля 20x30
const createImprovedDigitPatterns = () => {
  const patterns = {};
  const width = 20;
  const height = 30;
  const variationsPerDigit = 4; // Уменьшили количество вариаций
  
  // Создаем улучшенные паттерны для каждой цифры
  for (let digit = 0; digit <= 9; digit++) {
    patterns[digit] = [];
    
    for (let variation = 0; variation < variationsPerDigit; variation++) {
      const field = Array(height).fill().map(() => Array(width).fill(0));
      
      // Небольшие вариации (меньше случайности)
      const offsetX = (Math.random() - 0.5) * 1; // Уменьшили сдвиг
      const offsetY = (Math.random() - 0.5) * 1;
      
      switch(digit) {
        case 0: // Окружность
          const centerX = width / 2 + offsetX;
          const centerY = height / 2 + offsetY;
          const radius = Math.min(width, height) * 0.35;
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
              if (dist <= radius && dist >= radius * 0.6) {
                field[y][x] = 1;
              }
            }
          }
          break;
          
        case 1: // Вертикальная линия
          const midX = Math.floor(width * 0.5) + offsetX;
          for (let y = Math.floor(height * 0.15); y < Math.floor(height * 0.85); y++) {
            const x = Math.floor(midX);
            if (x >= 0 && x < width) field[y][x] = 1;
          }
          // Небольшая горизонтальная линия сверху
          for (let x = Math.floor(width * 0.4); x < Math.floor(width * 0.6); x++) {
            field[Math.floor(height * 0.2)][x] = 1;
          }
          break;
          
        case 2: // Форма двойки
          const base2 = Math.floor(width * 0.2) + offsetX;
          const right2 = Math.floor(width * 0.8) + offsetX;
          const top2 = Math.floor(height * 0.2) + offsetY;
          const mid2 = Math.floor(height * 0.5) + offsetY;
          const bottom2 = Math.floor(height * 0.8) + offsetY;
          
          // Верхняя горизонтальная
          for (let x = base2; x < right2; x++) {
            if (x >= 0 && x < width && top2 >= 0 && top2 < height) field[Math.floor(top2)][Math.floor(x)] = 1;
          }
          // Правая вертикальная (верхняя часть)
          for (let y = top2; y < mid2; y++) {
            if (y >= 0 && y < height) field[y][right2] = 1;
          }
          // Средняя горизонтальная
          for (let x = base2; x < right2; x++) {
            if (x >= 0 && x < width) field[mid2][x] = 1;
          }
          // Левая вертикальная (нижняя часть)
          for (let y = mid2; y < bottom2; y++) {
            if (y >= 0 && y < height) field[y][base2] = 1;
          }
          // Нижняя горизонтальная
          for (let x = base2; x < right2; x++) {
            if (x >= 0 && x < width) field[bottom2][x] = 1;
          }
          break;
          
        case 3: // Форма тройки
          const base3 = Math.floor(width * 0.2) + offsetX;
          const right3 = Math.floor(width * 0.8) + offsetX;
          const top3 = Math.floor(height * 0.2) + offsetY;
          const mid3 = Math.floor(height * 0.5) + offsetY;
          const bottom3 = Math.floor(height * 0.8) + offsetY;
          
          // Верхняя горизонтальная
          for (let x = base3; x < right3; x++) {
            if (x >= 0 && x < width) field[top3][x] = 1;
          }
          // Правая вертикальная
          for (let y = top3; y < bottom3; y++) {
            if (y >= 0 && y < height) field[y][right3] = 1;
          }
          // Средняя горизонтальная
          for (let x = base3; x < right3; x++) {
            if (x >= 0 && x < width) field[mid3][x] = 1;
          }
          // Нижняя горизонтальная
          for (let x = base3; x < right3; x++) {
            if (x >= 0 && x < width) field[bottom3][x] = 1;
          }
          break;
          
        case 4: // Форма четверки
          const base4 = Math.floor(width * 0.2) + offsetX;
          const right4 = Math.floor(width * 0.8) + offsetX;
          const mid4 = Math.floor(height * 0.5) + offsetY;
          
          // Левая вертикальная (верхняя часть)
          for (let y = Math.floor(height * 0.2); y < mid4; y++) {
            if (y >= 0 && y < height) field[y][base4] = 1;
          }
          // Средняя горизонтальная
          for (let x = base4; x < right4; x++) {
            if (x >= 0 && x < width) field[mid4][x] = 1;
          }
          // Правая вертикальная
          for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.8); y++) {
            if (y >= 0 && y < height) field[y][right4] = 1;
          }
          break;
          
        case 5: // Форма пятерки
          const base5 = Math.floor(width * 0.2) + offsetX;
          const right5 = Math.floor(width * 0.8) + offsetX;
          const top5 = Math.floor(height * 0.2) + offsetY;
          const mid5 = Math.floor(height * 0.5) + offsetY;
          const bottom5 = Math.floor(height * 0.8) + offsetY;
          
          // Верхняя горизонтальная
          for (let x = base5; x < right5; x++) {
            if (x >= 0 && x < width) field[top5][x] = 1;
          }
          // Левая вертикальная (верхняя часть)
          for (let y = top5; y < mid5; y++) {
            if (y >= 0 && y < height) field[y][base5] = 1;
          }
          // Средняя горизонтальная
          for (let x = base5; x < right5; x++) {
            if (x >= 0 && x < width) field[mid5][x] = 1;
          }
          // Правая вертикальная (нижняя часть)
          for (let y = mid5; y < bottom5; y++) {
            if (y >= 0 && y < height) field[y][right5] = 1;
          }
          // Нижняя горизонтальная
          for (let x = base5; x < right5; x++) {
            if (x >= 0 && x < width) field[bottom5][x] = 1;
          }
          break;
          
        case 6: // Форма шестерки
          const base6 = Math.floor(width * 0.2) + offsetX;
          const right6 = Math.floor(width * 0.8) + offsetX;
          const top6 = Math.floor(height * 0.2) + offsetY;
          const mid6 = Math.floor(height * 0.5) + offsetY;
          const bottom6 = Math.floor(height * 0.8) + offsetY;
          
          // Верхняя горизонтальная
          for (let x = base6; x < right6; x++) {
            if (x >= 0 && x < width) field[top6][x] = 1;
          }
          // Левая вертикальная
          for (let y = top6; y < bottom6; y++) {
            if (y >= 0 && y < height) field[y][base6] = 1;
          }
          // Средняя горизонтальная
          for (let x = base6; x < right6; x++) {
            if (x >= 0 && x < width) field[mid6][x] = 1;
          }
          // Правая вертикальная (нижняя часть)
          for (let y = mid6; y < bottom6; y++) {
            if (y >= 0 && y < height) field[y][right6] = 1;
          }
          // Нижняя горизонтальная
          for (let x = base6; x < right6; x++) {
            if (x >= 0 && x < width) field[bottom6][x] = 1;
          }
          break;
          
        case 7: // Форма семерки
          const base7 = Math.floor(width * 0.2) + offsetX;
          const right7 = Math.floor(width * 0.8) + offsetX;
          const top7 = Math.floor(height * 0.2) + offsetY;
          
          // Верхняя горизонтальная
          for (let x = base7; x < right7; x++) {
            if (x >= 0 && x < width) field[top7][x] = 1;
          }
          // Правая вертикальная
          for (let y = top7; y < Math.floor(height * 0.8); y++) {
            if (y >= 0 && y < height) field[y][right7] = 1;
          }
          break;
          
        case 8: // Форма восьмерки
          const base8 = Math.floor(width * 0.2) + offsetX;
          const right8 = Math.floor(width * 0.8) + offsetX;
          const top8 = Math.floor(height * 0.2) + offsetY;
          const mid8 = Math.floor(height * 0.5) + offsetY;
          const bottom8 = Math.floor(height * 0.8) + offsetY;
          
          // Верхняя горизонтальная
          for (let x = base8; x < right8; x++) {
            if (x >= 0 && x < width) field[top8][x] = 1;
          }
          // Средняя горизонтальная
          for (let x = base8; x < right8; x++) {
            if (x >= 0 && x < width) field[mid8][x] = 1;
          }
          // Нижняя горизонтальная
          for (let x = base8; x < right8; x++) {
            if (x >= 0 && x < width) field[bottom8][x] = 1;
          }
          // Левая вертикальная
          for (let y = top8; y < bottom8; y++) {
            if (y >= 0 && y < height) field[y][base8] = 1;
          }
          // Правая вертикальная
          for (let y = top8; y < bottom8; y++) {
            if (y >= 0 && y < height) field[y][right8] = 1;
          }
          break;
          
        case 9: // Форма девятки
          const base9 = Math.floor(width * 0.2) + offsetX;
          const right9 = Math.floor(width * 0.8) + offsetX;
          const top9 = Math.floor(height * 0.2) + offsetY;
          const mid9 = Math.floor(height * 0.5) + offsetY;
          const bottom9 = Math.floor(height * 0.8) + offsetY;
          
          // Верхняя горизонтальная
          for (let x = base9; x < right9; x++) {
            if (x >= 0 && x < width) field[top9][x] = 1;
          }
          // Средняя горизонтальная
          for (let x = base9; x < right9; x++) {
            if (x >= 0 && x < width) field[mid9][x] = 1;
          }
          // Нижняя горизонтальная
          for (let x = base9; x < right9; x++) {
            if (x >= 0 && x < width) field[bottom9][x] = 1;
          }
          // Левая вертикальная (верхняя часть)
          for (let y = top9; y < mid9; y++) {
            if (y >= 0 && y < height) field[y][base9] = 1;
          }
          // Правая вертикальная
          for (let y = top9; y < bottom9; y++) {
            if (y >= 0 && y < height) field[y][right9] = 1;
          }
          break;
      }
      
      // Конвертируем в плоский массив
      patterns[digit].push(field.flat());
    }
  }
  
  return patterns;
};

// Улучшенное обучение нейросети
const trainNetwork = (patterns, width = 20, height = 30) => {
  const totalPixels = width * height;
  const weights = {};
  const biases = {};
  
  // Инициализация весов
  for (let digit = 0; digit <= 9; digit++) {
    weights[digit] = new Array(totalPixels).fill(0).map(() => (Math.random() - 0.5) * 0.01);
    biases[digit] = (Math.random() - 0.5) * 0.01;
  }
  
  const learningRate = 0.02; // Увеличили learning rate
  const epochs = 12; // Увеличили количество эпох
  
  console.log('🚀 Начинаем улучшенное обучение...');
  console.log(`📊 Размер канваса: ${width}x${height}`);
  console.log(`📈 Эпох обучения: ${epochs}`);
  console.log(`🎨 Вариаций на цифру: 4`);
  console.log(`📋 Всего примеров: ${Object.keys(patterns).length * 4}`);
  console.log(`⚡ Learning rate: ${learningRate}`);
  
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
  console.log('🎯 Создание улучшенной модели (20x30)...');
  
  try {
    // Создаем улучшенные паттерны цифр
    const patterns = createImprovedDigitPatterns();
    console.log('✅ Улучшенные паттерны цифр созданы');
    
    // Обучаем нейросеть
    const { weights, biases } = trainNetwork(patterns, 20, 30);
    console.log('✅ Обучение завершено');
    
    // Создаем модель
    const model = {
      weights: {},
      biases: {},
      metadata: {
        version: "1.0",
        created: new Date().toISOString().split('T')[0],
        canvasWidth: 20,
        canvasHeight: 30,
        totalPixels: 600,
        description: "Улучшенная модель (20x30, 4 вариации на цифру)",
        trainingEpochs: 12,
        learningRate: 0.02,
        trainingExamples: 40,
        variationsPerDigit: 4
      }
    };
    
    // Копируем веса и смещения
    for (let digit = 0; digit <= 9; digit++) {
      model.weights[digit.toString()] = weights[digit];
      model.biases[digit.toString()] = biases[digit];
    }
    
    // Сохранение в папку public/models с уникальным именем
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const modelName = `improved-model-${timestamp}`;
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
      type: 'improved',
      description: model.metadata.description
    });
    
    fs.writeFileSync(modelsListPath, JSON.stringify(modelsList, null, 2));
    
    console.log('✅ Улучшенная модель создана и сохранена!');
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
