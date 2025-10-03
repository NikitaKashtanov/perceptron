// Утилиты для работы с предобученной моделью

// Загрузка предобученной модели из JSON файла
export const loadTrainedModel = async () => {
  try {
    const response = await fetch('./trainedModel.json');
    if (!response.ok) {
      throw new Error('Не удалось загрузить предобученную модель');
    }
    const modelData = await response.json();
    return modelData;
  } catch (error) {
    console.error('Ошибка загрузки модели:', error);
    return null;
  }
};

// Сохранение текущей модели в JSON файл
export const saveModelToFile = (weights, biases, canvasSize) => {
  const modelData = {
    weights: {},
    biases: {},
    metadata: {
      version: "1.0",
      created: new Date().toISOString().split('T')[0],
      canvasSize: canvasSize,
      totalPixels: canvasSize * canvasSize,
      description: "Обученная модель пользователя"
    }
  };

  // Копируем веса и смещения
  for (let digit = 0; digit <= 9; digit++) {
    modelData.weights[digit.toString()] = weights[digit] || [];
    modelData.biases[digit.toString()] = biases[digit] || 0;
  }

  // Создаем и скачиваем файл
  const dataStr = JSON.stringify(modelData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'trainedModel.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return modelData;
};

// Применение предобученной модели (подмена localStorage)
export const applyTrainedModel = (modelData) => {
  if (!modelData) return false;
  
  try {
    // Сохраняем текущее состояние localStorage как backup
    const currentWeights = localStorage.getItem('neuralNetwork_weights');
    const currentBiases = localStorage.getItem('neuralNetwork_biases');
    
    if (currentWeights && currentBiases) {
      localStorage.setItem('neuralNetwork_weights_backup', currentWeights);
      localStorage.setItem('neuralNetwork_biases_backup', currentBiases);
    }
    
    // Применяем новую модель
    localStorage.setItem('neuralNetwork_weights', JSON.stringify(modelData.weights));
    localStorage.setItem('neuralNetwork_biases', JSON.stringify(modelData.biases));
    
    return true;
  } catch (error) {
    console.error('Ошибка применения модели:', error);
    return false;
  }
};

// Восстановление предыдущей модели из backup
export const restoreBackupModel = () => {
  try {
    const backupWeights = localStorage.getItem('neuralNetwork_weights_backup');
    const backupBiases = localStorage.getItem('neuralNetwork_biases_backup');
    
    if (backupWeights && backupBiases) {
      localStorage.setItem('neuralNetwork_weights', backupWeights);
      localStorage.setItem('neuralNetwork_biases', backupBiases);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Ошибка восстановления модели:', error);
    return false;
  }
};

// Проверка совместимости модели с текущим размером канваса
export const isModelCompatible = (modelData, canvasWidth, canvasHeight = null) => {
  if (!modelData || !modelData.metadata) return false;
  
  // Если передан только canvasWidth, считаем квадратным (для обратной совместимости)
  const height = canvasHeight || canvasWidth;
  const expectedPixels = canvasWidth * height;
  const modelPixels = modelData.metadata.totalPixels;
  
  return modelPixels === expectedPixels;
};

// Получение списка доступных моделей
export const getAvailableModels = async () => {
  try {
    // Загружаем список моделей из models.json
    const response = await fetch('./models/models.json');
    if (!response.ok) {
      throw new Error('Не удалось загрузить список моделей');
    }
    
    const modelsList = await response.json();
    const models = [];
    
    // Проверяем каждую модель из списка
    for (const modelInfo of modelsList.models) {
      try {
        const modelResponse = await fetch(`./models/${modelInfo.name}.json`);
        if (modelResponse.ok) {
          const modelData = await modelResponse.json();
          models.push({
            name: modelInfo.name,
            metadata: modelData.metadata || {},
            type: modelInfo.type,
            description: modelInfo.description
          });
        }
      } catch (error) {
        // Модель не найдена, пропускаем
        console.log(`Модель ${modelInfo.name} не найдена`);
      }
    }
    
    return models;
  } catch (error) {
    console.error('Ошибка загрузки списка моделей:', error);
    return [];
  }
};

// Загрузка конкретной модели по имени
export const loadModelByName = async (modelName) => {
  try {
    const response = await fetch(`./models/${modelName}.json`);
    if (!response.ok) {
      throw new Error(`Не удалось загрузить модель ${modelName}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка загрузки модели:', error);
    return null;
  }
};

// Сохранение модели с уникальным именем
export const saveModelWithName = (weights, biases, canvasWidth, canvasHeight = null, description = "Обученная модель пользователя") => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const modelName = `user-model-${timestamp}`;
  
  // Если передан только canvasWidth, считаем квадратным (для обратной совместимости)
  const height = canvasHeight || canvasWidth;
  const totalPixels = canvasWidth * height;
  
  const modelData = {
    weights: {},
    biases: {},
    metadata: {
      version: "1.0",
      created: new Date().toISOString().split('T')[0],
      canvasWidth: canvasWidth,
      canvasHeight: height,
      totalPixels: totalPixels,
      description: description,
      name: modelName
    }
  };

  // Копируем веса и смещения
  for (let digit = 0; digit <= 9; digit++) {
    modelData.weights[digit.toString()] = weights[digit] || [];
    modelData.biases[digit.toString()] = biases[digit] || 0;
  }

  // Создаем и скачиваем файл
  const dataStr = JSON.stringify(modelData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `${modelName}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Показываем инструкции для пользователя
  console.log(`📁 Модель "${modelName}" скачана!`);
  console.log(`📋 Для добавления в список моделей:`);
  console.log(`1. Скопируйте файл ${modelName}.json в папку public/models/`);
  console.log(`2. Обновите файл public/models/models.json, добавив:`);
  console.log(`   {"name": "${modelName}", "type": "manual", "description": "${description}"}`);
  
  return { modelData, modelName };
};

// Генерация случайной модели для демонстрации
export const generateRandomModel = (canvasSize) => {
  const totalPixels = canvasSize * canvasSize;
  const weights = {};
  const biases = {};
  
  for (let digit = 0; digit <= 9; digit++) {
    weights[digit] = new Array(totalPixels).fill(0).map(() => 
      Math.random() * 0.2 - 0.1
    );
    biases[digit] = Math.random() * 0.2 - 0.1;
  }
  
  return {
    weights,
    biases,
    metadata: {
      version: "1.0",
      created: new Date().toISOString().split('T')[0],
      canvasSize: canvasSize,
      totalPixels: totalPixels,
      description: "Случайная модель для демонстрации"
    }
  };
};
