// Простая и надежная нейросеть для распознавания цифр

// Простая сигмоидальная функция
const sigmoid = (x) => {
  // Ограничиваем входное значение
  x = Math.max(-10, Math.min(10, x));
  return 1 / (1 + Math.exp(-x));
};

// Инициализация весов
const initializeWeights = (inputSize) => {
  const weights = {};
  const biases = {};
  
  for (let digit = 0; digit <= 9; digit++) {
    weights[digit] = [];
    biases[digit] = 0;
    
    for (let i = 0; i < inputSize; i++) {
      weights[digit][i] = (Math.random() - 0.5) * 0.01; // Очень маленькие веса
    }
  }
  
  return { weights, biases };
};

// Предсказание для одной цифры
const predictDigit = (input, weights, biases, digit) => {
  let sum = biases[digit];
  
  for (let i = 0; i < input.length; i++) {
    sum += input[i] * weights[digit][i];
  }
  
  return sigmoid(sum);
};

// Обучение на одном примере
const trainExample = (input, target, weights, biases, learningRate) => {
  // Создаем копии весов и смещений
  const newWeights = {};
  const newBiases = {};
  
  for (let digit = 0; digit <= 9; digit++) {
    newWeights[digit] = [...weights[digit]];
    newBiases[digit] = biases[digit];
  }
  
  // Обновляем веса для всех цифр
  for (let digit = 0; digit <= 9; digit++) {
    const prediction = predictDigit(input, weights, biases, digit);
    const targetValue = digit === target ? 1 : 0;
    const error = targetValue - prediction;
    
    // Обновляем веса
    for (let i = 0; i < input.length; i++) {
      newWeights[digit][i] += error * input[i] * learningRate;
    }
    
    newBiases[digit] += error * learningRate;
  }
  
  return { weights: newWeights, biases: newBiases };
};

// Простое обучение
const trainSimple = (trainingData, epochs = 20, learningRate = 0.01) => {
  const inputSize = trainingData[0].input.length;
  let { weights, biases } = initializeWeights(inputSize);
  
  console.log(`Обучение на ${trainingData.length} примерах...`);
  
  for (let epoch = 0; epoch < epochs; epoch++) {
    let totalError = 0;
    
    for (const example of trainingData) {
      const result = trainExample(example.input, example.target, weights, biases, learningRate);
      weights = result.weights;
      biases = result.biases;
      
      // Вычисляем ошибку
      for (let digit = 0; digit <= 9; digit++) {
        const prediction = predictDigit(example.input, weights, biases, digit);
        const targetValue = digit === example.target ? 1 : 0;
        totalError += Math.abs(targetValue - prediction);
      }
    }
    
    if (epoch % 5 === 0) {
      console.log(`Эпоха ${epoch}: Ошибка = ${(totalError / (trainingData.length * 10)).toFixed(4)}`);
    }
  }
  
  return { weights, biases };
};

// Тестирование
const testModel = (testData, weights, biases) => {
  let correct = 0;
  
  for (const example of testData) {
    let maxPrediction = -1;
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
  
  const accuracy = (correct / testData.length) * 100;
  console.log(`Точность: ${accuracy.toFixed(2)}% (${correct}/${testData.length})`);
  return accuracy;
};

// Создание модели
const createSimpleModel = (weights, biases, canvasWidth, canvasHeight, accuracy) => {
  return {
    weights: weights,
    biases: biases,
    metadata: {
      version: "1.0",
      created: new Date().toISOString().split('T')[0],
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight,
      totalPixels: canvasWidth * canvasHeight,
      description: `Простая модель с точностью ${accuracy.toFixed(2)}%`,
      trainingEpochs: 20,
      learningRate: 0.01,
      trainingExamples: canvasWidth * canvasHeight * 5
    }
  };
};

// Основная функция обучения
export const trainSimpleNeuralNetwork = async (canvasWidth = 30, canvasHeight = null) => {
  console.log('🚀 Простое обучение нейросети...');
  
  try {
    // Если передан только canvasWidth, считаем квадратным (для обратной совместимости)
    const height = canvasHeight || canvasWidth;
    
    // Импортируем генератор паттернов
    const { generateTrainingData } = await import('../data/digitPatterns.js');
    const trainingData = generateTrainingData(canvasWidth, height, 5);
    
    console.log(`📊 Создано ${trainingData.length} примеров`);
    
    // Разделяем данные
    const shuffledData = [...trainingData].sort(() => Math.random() - 0.5);
    const splitIndex = Math.floor(shuffledData.length * 0.8);
    const trainSet = shuffledData.slice(0, splitIndex);
    const testSet = shuffledData.slice(splitIndex);
    
    console.log(`📚 Обучающих: ${trainSet.length}, тестовых: ${testSet.length}`);
    
    // Обучаем
    const { weights, biases } = trainSimple(trainSet, 20, 0.01);
    
    // Тестируем
    const accuracy = testModel(testSet, weights, biases);
    
    // Создаем модель
    const model = createSimpleModel(weights, biases, canvasWidth, height, accuracy);
    
    console.log('✅ Обучение завершено!');
    return model;
    
  } catch (error) {
    console.error('❌ Ошибка обучения:', error);
    throw error;
  }
};
