import React, { useState, useEffect } from 'react';
import { loadTrainedModel, saveModelToFile, saveModelWithName, applyTrainedModel, restoreBackupModel, isModelCompatible, loadModelByName } from './modelUtils';
import { trainSimpleNeuralNetwork } from './simpleNeuralNetwork';
import ModelSelector from './ModelSelector';
import './NeuralNetwork.css';

const NeuralNetwork = ({ pixelData, canvasWidth = 100, canvasHeight = 100 }) => {
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [trainingDigit, setTrainingDigit] = useState('');
  const [weights, setWeights] = useState({});
  const [biases, setBiases] = useState({});
  const [predictions, setPredictions] = useState({});
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [learningRate, setLearningRate] = useState(0.01);
  const [trainedModel, setTrainedModel] = useState(null);
  const [isUsingTrainedModel, setIsUsingTrainedModel] = useState(false);
  const [modelStatus, setModelStatus] = useState('');
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [selectedModelName, setSelectedModelName] = useState('');

  const totalPixels = canvasWidth * canvasHeight;

  // Сигмоидальная функция
  const sigmoid = (x) => {
    return 1 / (1 + Math.exp(-x));
  };

  // Инициализация весов
  const initializeWeights = () => {
    const newWeights = {};
    const newBiases = {};
    
    for (let digit = 0; digit <= 9; digit++) {
      newWeights[digit] = new Array(totalPixels).fill(0).map(() => 
        Math.random() * 0.1 - 0.05
      );
      newBiases[digit] = 0;
    }
    
    setWeights(newWeights);
    setBiases(newBiases);
    saveToLocalStorage(newWeights, newBiases);
  };

  // Загрузка из localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedWeights = localStorage.getItem('neuralNetwork_weights');
      const savedBiases = localStorage.getItem('neuralNetwork_biases');
      
      if (savedWeights && savedBiases) {
        setWeights(JSON.parse(savedWeights));
        setBiases(JSON.parse(savedBiases));
        return true;
      }
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error);
    }
    return false;
  };

  // Сохранение в localStorage
  const saveToLocalStorage = (weightsData, biasesData) => {
    try {
      localStorage.setItem('neuralNetwork_weights', JSON.stringify(weightsData));
      localStorage.setItem('neuralNetwork_biases', JSON.stringify(biasesData));
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
    }
  };

  // Предсказание для одной цифры
  const predictDigit = (pixelData, digit) => {
    if (!pixelData || !weights[digit]) return 0;
    
    let sum = biases[digit] || 0;
    
    for (let i = 0; i < Math.min(pixelData.length, totalPixels); i++) {
      sum += pixelData[i] * weights[digit][i];
    }
    
    return sigmoid(sum);
  };

  // Обучение на одном примере
  const trainOnExample = (pixelData, targetDigit) => {
    if (!pixelData || targetDigit === '') return;
    
    const digit = parseInt(targetDigit);
    if (isNaN(digit) || digit < 0 || digit > 9) return;
    
    const newWeights = { ...weights };
    const newBiases = { ...biases };
    
    // Обновляем веса для всех цифр
    for (let d = 0; d <= 9; d++) {
      const prediction = predictDigit(pixelData, d);
      const target = (d === digit) ? 1 : 0;
      const error = target - prediction;
      
      // Обновляем веса
      if (!newWeights[d]) {
        newWeights[d] = new Array(totalPixels).fill(0);
      }
      
      for (let i = 0; i < Math.min(pixelData.length, totalPixels); i++) {
        newWeights[d][i] += error * pixelData[i] * learningRate;
      }
      
      newBiases[d] = (newBiases[d] || 0) + error * learningRate;
    }
    
    setWeights(newWeights);
    setBiases(newBiases);
    saveToLocalStorage(newWeights, newBiases);
    
    // Добавляем в историю обучения
    const historyEntry = {
      timestamp: new Date().toLocaleTimeString(),
      digit: digit,
      pixels: pixelData.filter(p => p === 1).length
    };
    setTrainingHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
  };

  // Распознавание
  const recognize = () => {
    if (!pixelData) return;
    
    const newPredictions = {};
    let maxPrediction = 0;
    let recognizedDigit = '?';
    
    for (let digit = 0; digit <= 9; digit++) {
      const prediction = predictDigit(pixelData, digit);
      newPredictions[digit] = prediction;
      
      if (prediction > maxPrediction) {
        maxPrediction = prediction;
        recognizedDigit = digit;
      }
    }
    
    setPredictions(newPredictions);
  };

  // Очистка весов
  const clearWeights = () => {
    if (window.confirm('Вы уверены, что хотите очистить все обученные веса?')) {
      localStorage.removeItem('neuralNetwork_weights');
      localStorage.removeItem('neuralNetwork_biases');
      initializeWeights();
      setTrainingHistory([]);
      setPredictions({});
      setIsUsingTrainedModel(false);
      setModelStatus('');
    }
  };

  // Загрузка предобученной модели
  const handleLoadTrainedModel = async () => {
    setModelStatus('Загрузка модели...');
    const modelData = await loadTrainedModel();
    
    if (!modelData) {
      setModelStatus('Ошибка загрузки модели');
      return;
    }
    
    if (!isModelCompatible(modelData, canvasWidth, canvasHeight)) {
      const modelWidth = modelData.metadata.canvasWidth || modelData.metadata.canvasSize;
      const modelHeight = modelData.metadata.canvasHeight || modelData.metadata.canvasSize;
      setModelStatus(`Модель несовместима. Размер канваса: ${canvasWidth}x${canvasHeight}, модель: ${modelWidth}x${modelHeight}`);
      return;
    }
    
    setTrainedModel(modelData);
    setModelStatus(`Модель загружена: ${modelData.metadata.description}`);
  };

  // Применение предобученной модели
  const handleUseTrainedModel = () => {
    if (!trainedModel) {
      setModelStatus('Сначала загрузите модель');
      return;
    }
    
    const success = applyTrainedModel(trainedModel);
    if (success) {
      setIsUsingTrainedModel(true);
      setModelStatus('Предобученная модель применена');
      // Перезагружаем веса из localStorage
      loadFromLocalStorage();
    } else {
      setModelStatus('Ошибка применения модели');
    }
  };

  // Сохранение текущей модели в файл
  const handleSaveModelToFile = () => {
    try {
      // Проверяем, есть ли обученные данные
      const hasTrainingData = Object.keys(weights).length > 0 && 
                             Object.values(weights).some(w => w && w.length > 0);
      
      if (!hasTrainingData) {
        setModelStatus('Нет данных для сохранения. Сначала обучите модель на примерах.');
        return;
      }
      
      // Создаем описание на основе истории обучения
      const trainingCount = trainingHistory.length;
      const description = `Ручное обучение (${trainingCount} примеров)`;
      
      const { modelData, modelName } = saveModelWithName(weights, biases, canvasWidth, canvasHeight, description);
      
      setModelStatus(`Модель "${modelName}" скачана! Проверьте консоль для инструкций по добавлению в список моделей.`);
      setSelectedModelName(modelName);
      
    } catch (error) {
      console.error('Ошибка сохранения модели:', error);
      setModelStatus('Ошибка сохранения модели');
    }
  };

  // Восстановление предыдущей модели
  const handleRestoreBackup = () => {
    const success = restoreBackupModel();
    if (success) {
      setIsUsingTrainedModel(false);
      setModelStatus('Предыдущая модель восстановлена');
      loadFromLocalStorage();
    } else {
      setModelStatus('Нет резервной копии для восстановления');
    }
  };

  // Обучение новой модели
  const handleTrainNewModel = async () => {
    setIsTrainingModel(true);
    setModelStatus('Обучение модели... Это может занять несколько секунд');
    
    try {
      const newModel = await trainSimpleNeuralNetwork(canvasWidth, canvasHeight);
      
      // Применяем новую модель
      const success = applyTrainedModel(newModel);
      if (success) {
        setTrainedModel(newModel);
        setIsUsingTrainedModel(true);
        setModelStatus(`Новая модель обучена! Точность: ${newModel.metadata.description}`);
        loadFromLocalStorage();
      } else {
        setModelStatus('Ошибка применения обученной модели');
      }
    } catch (error) {
      console.error('Ошибка обучения:', error);
      setModelStatus('Ошибка при обучении модели');
    } finally {
      setIsTrainingModel(false);
    }
  };

  // Обработчик выбора модели из ModelSelector
  const handleModelSelect = (modelData, modelName) => {
    if (!modelData) return;
    
    // Проверяем совместимость модели
    if (!isModelCompatible(modelData, canvasWidth, canvasHeight)) {
      const modelWidth = modelData.metadata.canvasWidth || modelData.metadata.canvasSize;
      const modelHeight = modelData.metadata.canvasHeight || modelData.metadata.canvasSize;
      setModelStatus(`Модель ${modelName} несовместима с размером канваса ${canvasWidth}x${canvasHeight} (модель: ${modelWidth}x${modelHeight})`);
      return;
    }
    
    // Применяем выбранную модель
    const success = applyTrainedModel(modelData);
    if (success) {
      setTrainedModel(modelData);
      setIsUsingTrainedModel(true);
      setSelectedModelName(modelName);
      setModelStatus(`Загружена модель: ${modelName}`);
      loadFromLocalStorage();
    } else {
      setModelStatus('Ошибка применения выбранной модели');
    }
  };

  // Обработчик обновления списка моделей
  const handleModelRefresh = () => {
    setModelStatus('Список моделей обновлен');
  };

  // Инициализация при загрузке
  useEffect(() => {
    if (!loadFromLocalStorage()) {
      initializeWeights();
    }
  }, []);

  // Автоматическое распознавание при изменении пикселей
  useEffect(() => {
    if (pixelData && !isTrainingMode) {
      recognize();
    }
  }, [pixelData, isTrainingMode]);

  // Принудительное распознавание при выходе из режима обучения
  useEffect(() => {
    if (!isTrainingMode && pixelData) {
      recognize();
    }
  }, [isTrainingMode]);

  return (
    <div className="neural-network">
      <h3>Нейросеть для распознавания цифр</h3>
      
      {/* Результаты распознавания */}
      <div className="recognition-section">
        <div className="recognition-header">
          <h4>Результаты распознавания:</h4>
          {!isTrainingMode && (
            <button onClick={recognize} className="recognize-button">
              Распознать сейчас
            </button>
          )}
        </div>
        
        {Object.keys(predictions).length > 0 ? (
          <>
            <div className="predictions-grid">
              {Object.entries(predictions).map(([digit, confidence]) => (
                <div key={digit} className="prediction-item">
                  <span className="digit">{digit}</span>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="confidence-value">
                    {(confidence * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            
            <div className="final-prediction">
              <strong>
                Распознанная цифра: {
                  Object.entries(predictions).reduce((max, [digit, confidence]) => 
                    confidence > max.confidence ? { digit, confidence } : max, 
                    { digit: '?', confidence: 0 }
                  ).digit
                }
              </strong>
            </div>
          </>
        ) : (
          <div className="no-prediction">
            {isTrainingMode ? (
              <p>Режим обучения активен. Распознавание отключено.</p>
            ) : (
              <p>Нарисуйте цифру на канвасе для распознавания.</p>
            )}
          </div>
        )}
      </div>
      
      {/* Режим обучения */}
      <div className="training-section">
        <div className="training-controls">
          <button 
            onClick={() => setIsTrainingMode(!isTrainingMode)}
            className={`training-toggle ${isTrainingMode ? 'active' : ''}`}
          >
            {isTrainingMode ? 'Остановить обучение' : 'Режим обучения'}
          </button>
          
          {isTrainingMode && (
            <div className="training-indicator">
              <span className="indicator-dot"></span>
              Режим обучения активен
            </div>
          )}
        </div>
        
        {isTrainingMode && (
          <div className="training-input">
            <label htmlFor="digit-input">Введите цифру (0-9):</label>
            <input
              id="digit-input"
              type="text"
              maxLength="1"
              value={trainingDigit}
              onChange={(e) => setTrainingDigit(e.target.value.replace(/\D/g, ''))}
              placeholder="0-9"
              className="digit-input"
            />
            <button 
              onClick={() => trainOnExample(pixelData, trainingDigit)}
              disabled={!pixelData || trainingDigit === ''}
              className="train-button"
            >
              Обучить
            </button>
          </div>
        )}
      </div>

      {/* Настройки */}
      <div className="settings-section">
        <label htmlFor="learning-rate">Скорость обучения:</label>
        <input
          id="learning-rate"
          type="range"
          min="0.001"
          max="0.1"
          step="0.001"
          value={learningRate}
          onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          className="learning-rate-slider"
        />
        <span className="learning-rate-value">{learningRate}</span>
        
        <button onClick={clearWeights} className="clear-weights-button">
          Очистить веса
        </button>
      </div>

      {/* Выбор модели */}
      <ModelSelector
        onModelSelect={handleModelSelect}
        selectedModel={selectedModelName}
        onRefresh={handleModelRefresh}
      />

      {/* Управление предобученной моделью */}
      <div className="model-management-section">
        <h4>Управление предобученной моделью</h4>
        
        <div className="model-controls">
          <button 
            onClick={handleTrainNewModel}
            disabled={isTrainingModel}
            className="train-model-button"
          >
            {isTrainingModel ? 'Обучение...' : 'Обучить новую модель'}
          </button>
          
          <button 
            onClick={handleLoadTrainedModel}
            className="load-model-button"
          >
            Загрузить модель из файла
          </button>
          
          <button 
            onClick={handleUseTrainedModel}
            disabled={!trainedModel}
            className="use-model-button"
          >
            Использовать обученную модель
          </button>
          
          <button 
            onClick={handleSaveModelToFile}
            className="save-model-button"
          >
            Сохранить обучение в файл
          </button>
          
          <button 
            onClick={handleRestoreBackup}
            className="restore-backup-button"
          >
            Восстановить предыдущую модель
          </button>
        </div>
        
        {modelStatus && (
          <div className={`model-status ${isUsingTrainedModel ? 'using-trained' : ''}`}>
            <strong>Статус:</strong> {modelStatus}
          </div>
        )}

        {/* Информация о текущей модели */}
        <div className="current-model-info">
          <h5>Текущая модель:</h5>
          <div className="model-description">
            {isUsingTrainedModel && trainedModel ? (
              <div className="trained-model-active">
                <span className="model-type">🤖 Предобученная модель</span>
                <span className="model-desc">{trainedModel.metadata.description}</span>
                <span className="model-date">Создана: {trainedModel.metadata.created}</span>
              </div>
            ) : (
              <div className="manual-model-active">
                <span className="model-type">✋ Ручное обучение</span>
                <span className="model-desc">Модель обучена вручную на ваших примерах</span>
                <span className="model-examples">Примеров обучения: {trainingHistory.length}</span>
              </div>
            )}
          </div>
        </div>
        
        {trainedModel && (
          <div className="model-info">
            <h5>Информация о модели:</h5>
            <ul>
              <li><strong>Описание:</strong> {trainedModel.metadata.description}</li>
              <li><strong>Дата создания:</strong> {trainedModel.metadata.created}</li>
              <li><strong>Размер канваса:</strong> {trainedModel.metadata.canvasWidth || trainedModel.metadata.canvasSize}x{trainedModel.metadata.canvasHeight || trainedModel.metadata.canvasSize}</li>
              <li><strong>Всего пикселей:</strong> {trainedModel.metadata.totalPixels}</li>
            </ul>
          </div>
        )}
      </div>

      {/* История обучения */}
      {trainingHistory.length > 0 && (
        <div className="training-history">
          <h4>История обучения:</h4>
          <div className="history-list">
            {trainingHistory.map((entry, index) => (
              <div key={index} className="history-item">
                <span className="time">{entry.timestamp}</span>
                <span className="digit">Цифра: {entry.digit}</span>
                <span className="pixels">Пикселей: {entry.pixels}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NeuralNetwork;

