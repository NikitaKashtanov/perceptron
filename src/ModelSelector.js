import React, { useState, useEffect } from 'react';
import './ModelSelector.css';

const ModelSelector = ({ onModelSelect, selectedModel, onRefresh }) => {
  const [availableModels, setAvailableModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Загрузка списка доступных моделей
  const loadAvailableModels = async () => {
    setIsLoading(true);
    setError('');
    
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
        } catch (err) {
          // Модель не найдена, пропускаем
          console.log(`Модель ${modelInfo.name} не найдена`);
        }
      }
      
      setAvailableModels(models);
    } catch (err) {
      console.error('Ошибка загрузки моделей:', err);
      setError('Ошибка загрузки списка моделей');
      setAvailableModels([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка модели по имени
  const loadModel = async (modelName) => {
    try {
      const response = await fetch(`./models/${modelName}.json`);
      if (!response.ok) {
        throw new Error(`Не удалось загрузить модель ${modelName}`);
      }
      
      const modelData = await response.json();
      onModelSelect(modelData, modelName);
      setError('');
    } catch (err) {
      console.error('Ошибка загрузки модели:', err);
      setError(`Ошибка загрузки модели ${modelName}`);
    }
  };

  // Обновление списка моделей
  const handleRefresh = () => {
    loadAvailableModels();
    if (onRefresh) {
      onRefresh();
    }
  };

  // Загрузка списка при монтировании компонента
  useEffect(() => {
    loadAvailableModels();
  }, []);

  return (
    <div className="model-selector">
      <div className="model-selector-header">
        <h4>Выбор модели</h4>
        <button 
          onClick={handleRefresh} 
          className="refresh-button"
          disabled={isLoading}
        >
          {isLoading ? '🔄' : '🔄'} Обновить
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <div className="loading-message">
          📡 Загрузка списка моделей...
        </div>
      ) : (
        <div className="models-list">
          {availableModels.length === 0 ? (
            <div className="no-models">
              📭 Нет доступных моделей
              <br />
              <small>Создайте новую модель с помощью кнопки "Обучить новую модель"</small>
            </div>
          ) : (
            availableModels.map((model) => (
              <div 
                key={model.name}
                className={`model-item ${selectedModel === model.name ? 'selected' : ''}`}
                onClick={() => loadModel(model.name)}
              >
                <div className="model-name">
                  🧠 {model.name}
                </div>
                <div className="model-description">
                  {model.description || model.metadata.description}
                </div>
                <div className="model-details">
                  <span className="model-date">📅 {model.metadata.created}</span>
                  <span className="model-size">📏 {model.metadata.canvasWidth || model.metadata.canvasSize}×{model.metadata.canvasHeight || model.metadata.canvasSize}</span>
                  <span className="model-epochs">🔄 {model.metadata.trainingEpochs} эпох</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedModel && (
        <div className="selected-model-info">
          <strong>Выбранная модель:</strong> {selectedModel}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
