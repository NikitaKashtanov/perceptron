import React, { useState } from 'react';
import Canvas from './Canvas';
import PixelProcessor from './PixelProcessor';
import NeuralNetwork from './NeuralNetwork';
import './App.css';

function App() {
  const [pixelData, setPixelData] = useState(null);
  const [canvasSize, setCanvasSize] = useState(30);

  const handlePixelDataChange = (data) => {
    setPixelData(data);
  };

  const handleCanvasSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    if (newSize >= 20 && newSize <= 100) {
      setCanvasSize(newSize);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Нейросеть для распознавания символов</h1>
        <p>Рисуйте цифры на канвасе и анализируйте пиксельные данные</p>
        
        <div className="canvas-size-control">
          <label htmlFor="canvas-size">Размер канваса: </label>
          <input
            id="canvas-size"
            type="number"
            min="20"
            max="100"
            value={canvasSize}
            onChange={handleCanvasSizeChange}
            className="size-input"
          />
          <span>пикселей</span>
        </div>

        <Canvas 
          width={canvasSize} 
          height={canvasSize} 
          onPixelDataChange={handlePixelDataChange}
        />

        <PixelProcessor 
          pixelData={pixelData} 
          canvasWidth={canvasSize} 
          canvasHeight={canvasSize}
        />

        <NeuralNetwork 
          pixelData={pixelData} 
          canvasWidth={canvasSize} 
          canvasHeight={canvasSize}
        />

        <div className="info-section">
          <h3>Инструкции по использованию:</h3>
          <ul>
            <li><strong>Рисование:</strong> Рисуйте цифры мышкой на канвасе</li>
            <li><strong>Обучение:</strong> Включите режим обучения, введите цифру (0-9) и нажмите "Обучить"</li>
            <li><strong>Распознавание:</strong> Выйдите из режима обучения - нейросеть автоматически распознает цифры</li>
            <li><strong>Настройки:</strong> Изменяйте размер канваса и скорость обучения</li>
            <li><strong>Сохранение:</strong> Веса автоматически сохраняются в localStorage</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
