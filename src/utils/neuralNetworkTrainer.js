// Алгоритм обучения нейросети для распознавания цифр

// Сигмоидальная функция с защитой от переполнения
const sigmoid = (x) => {
  // Ограничиваем x для избежания переполнения
  x = Math.max(-500, Math.min(500, x));
  
  if (x >= 0) {
    return 1 / (1 + Math.exp(-x));
  } else {
    const expX = Math.exp(x);
    return expX / (1 + expX);
  }
};

// Производная сигмоидальной функции
const sigmoidDerivative = (x) => {
  const s = sigmoid(x);
  return s * (1 - s);
};

// Инициализация весов случайными значениями
const initializeWeights = (inputSize, outputSize) => {
  const weights = {};
  const biases = {};
  
  for (let digit = 0; digit <= 9; digit++) {
    weights[digit] = new Array(inputSize).fill(0).map(() => {
      const weight = Math.random() * 0.02 - 0.01; // Меньший диапазон
      return isNaN(weight) ? 0 : weight;
    });
    
    const bias = Math.random() * 0.02 - 0.01;
    biases[digit] = isNaN(bias) ? 0 : bias;
  }
  
  return { weights, biases };
};

// Предсказание для одной цифры
const predictDigit = (input, weights, biases, digit) => {
  let sum = biases[digit] || 0;
  
  for (let i = 0; i < input.length; i++) {
    const weight = weights[digit][i] || 0;
    const pixel = input[i] || 0;
    const product = weight * pixel;
    
    if (!isNaN(product)) {
      sum += product;
    }
  }
  
  // Ограничиваем сумму для избежания переполнения
  sum = Math.max(-10, Math.min(10, sum));
  
  const result = sigmoid(sum);
  return isNaN(result) ? 0.5 : result;
};

// Обучение на одном примере
const trainOnExample = (input, target, weights, biases, learningRate) => {
  const newWeights = {};
  const newBiases = {};
  
  // Копируем веса и смещения
  for (let digit = 0; digit <= 9; digit++) {
    newWeights[digit] = [...weights[digit]];
    newBiases[digit] = biases[digit];
  }
  
  // Обновляем веса для всех цифр
  for (let digit = 0; digit <= 9; digit++) {
    const prediction = predictDigit(input, weights, biases, digit);
    const targetValue = (digit === target) ? 1 : 0;
    const error = targetValue - prediction;
    
    // Проверяем на NaN
    if (isNaN(error) || isNaN(prediction)) {
      console.warn(`NaN detected: digit=${digit}, prediction=${prediction}, error=${error}`);
      continue;
    }
    
    // Обновляем веса
    for (let i = 0; i < input.length; i++) {
      const weightUpdate = error * input[i] * learningRate;
      if (!isNaN(weightUpdate)) {
        newWeights[digit][i] += weightUpdate;
      }
    }
    
    const biasUpdate = error * learningRate;
    if (!isNaN(biasUpdate)) {
      newBiases[digit] += biasUpdate;
    }
  }
  
  return { weights: newWeights, biases: newBiases };
};

// Обучение на всем наборе данных
const trainNetwork = (trainingData, epochs = 50, learningRate = 0.005) => {
  const inputSize = trainingData[0].input.length;
  let { weights, biases } = initializeWeights(inputSize, 10);
  
  console.log(`Начинаем обучение на ${trainingData.length} примерах...`);
  
  for (let epoch = 0; epoch < epochs; epoch++) {
    let totalError = 0;
    
    // Перемешиваем данные для каждого эпоха
    const shuffledData = [...trainingData].sort(() => Math.random() - 0.5);
    
    for (const example of shuffledData) {
      const result = trainOnExample(example.input, example.target, weights, biases, learningRate);
      weights = result.weights;
      biases = result.biases;
      
      // Вычисляем общую ошибку
      for (let digit = 0; digit <= 9; digit++) {
        const prediction = predictDigit(example.input, weights, biases, digit);
        const targetValue = (digit === example.target) ? 1 : 0;
        totalError += Math.abs(targetValue - prediction);
      }
    }
    
    // Выводим прогресс каждые 10 эпохов
    if (epoch % 10 === 0) {
      console.log(`Эпоха ${epoch}: Средняя ошибка = ${(totalError / (trainingData.length * 10)).toFixed(4)}`);
    }
  }
  
  console.log('Обучение завершено!');
  return { weights, biases };
};

// Тестирование точности модели
const testAccuracy = (testData, weights, biases) => {
  let correct = 0;
  let total = testData.length;
  
  for (const example of testData) {
    let maxPrediction = 0;
    let predictedDigit = 0;
    
    for (let digit = 0; digit <= 9; digit++) {
      const prediction = predictDigit(example.input, weights, biases, digit);
      if (prediction > maxPrediction) {
        maxPrediction = prediction;
        predictedDigit = digit;
      }
    }
    
    if (predictedDigit === example.target) {
      correct++;
    }
  }
  
  const accuracy = (correct / total) * 100;
  console.log(`Точность на тестовых данных: ${accuracy.toFixed(2)}% (${correct}/${total})`);
  return accuracy;
};

// Создание финальной модели в формате JSON
const createModelJSON = (weights, biases, canvasSize, accuracy) => {
  return {
    weights: weights,
    biases: biases,
    metadata: {
      version: "1.0",
      created: new Date().toISOString().split('T')[0],
      canvasSize: canvasSize,
      totalPixels: canvasSize * canvasSize,
      description: `Предобученная модель с точностью ${accuracy.toFixed(2)}%`,
      trainingEpochs: 50,
      learningRate: 0.005,
      trainingExamples: canvasSize * canvasSize * 5 // 5 вариантов каждой цифры
    }
  };
};

// Основная функция обучения
export const trainNeuralNetwork = async (canvasSize = 30) => {
  console.log('🚀 Начинаем обучение нейросети...');
  
  // Генерируем обучающие данные
  const { generateTrainingData } = await import('../data/digitPatterns.js');
  const trainingData = generateTrainingData(canvasSize, canvasSize, 5);
  
  console.log(`📊 Создано ${trainingData.length} обучающих примеров`);
  
  // Разделяем на обучающие и тестовые данные (80/20)
  const shuffledData = [...trainingData].sort(() => Math.random() - 0.5);
  const splitIndex = Math.floor(shuffledData.length * 0.8);
  const trainSet = shuffledData.slice(0, splitIndex);
  const testSet = shuffledData.slice(splitIndex);
  
  console.log(`📚 Обучающих примеров: ${trainSet.length}`);
  console.log(`🧪 Тестовых примеров: ${testSet.length}`);
  
  // Обучаем модель
  const { weights, biases } = trainNetwork(trainSet, 100, 0.01);
  
  // Тестируем точность
  const accuracy = testAccuracy(testSet, weights, biases);
  
  // Создаем финальную модель
  const modelJSON = createModelJSON(weights, biases, canvasSize, accuracy);
  
  console.log('✅ Обучение завершено!');
  console.log(`📈 Точность модели: ${accuracy.toFixed(2)}%`);
  
  return modelJSON;
};

// Функция для сохранения модели в файл
export const saveTrainedModel = async (canvasSize = 30) => {
  const model = await trainNeuralNetwork(canvasSize);
  
  // Создаем и скачиваем файл
  const dataStr = JSON.stringify(model, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'trainedModel.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('💾 Модель сохранена в файл trainedModel.json');
  return model;
};
