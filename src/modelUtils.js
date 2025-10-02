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
export const isModelCompatible = (modelData, canvasSize) => {
  if (!modelData || !modelData.metadata) return false;
  
  const expectedPixels = canvasSize * canvasSize;
  const modelPixels = modelData.metadata.totalPixels;
  
  return modelPixels === expectedPixels;
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
