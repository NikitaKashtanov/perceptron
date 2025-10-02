import React, { useState } from 'react';
import Canvas from './Canvas';
import PixelProcessor from './PixelProcessor';
import NeuralNetwork from './NeuralNetwork';
import './App.css';

function App() {
  const [pixelData, setPixelData] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(20);
  const [canvasHeight, setCanvasHeight] = useState(30);

  const handlePixelDataChange = (data) => {
    setPixelData(data);
  };

  const handleCanvasWidthChange = (event) => {
    const newWidth = parseInt(event.target.value);
    if (newWidth >= 15 && newWidth <= 50) {
      setCanvasWidth(newWidth);
    }
  };

  const handleCanvasHeightChange = (event) => {
    const newHeight = parseInt(event.target.value);
    if (newHeight >= 20 && newHeight <= 60) {
      setCanvasHeight(newHeight);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Нейросеть для распознавания символов</h1>
        <p>Рисуйте цифры на канвасе и анализируйте пиксельные данные</p>
        
        <div className="canvas-size-control">
          <label htmlFor="canvas-width">Ширина канваса: </label>
          <input
            id="canvas-width"
            type="number"
            min="15"
            max="50"
            value={canvasWidth}
            onChange={handleCanvasWidthChange}
            className="size-input"
          />
          <span>×</span>
          <label htmlFor="canvas-height">Высота канваса: </label>
          <input
            id="canvas-height"
            type="number"
            min="20"
            max="60"
            value={canvasHeight}
            onChange={handleCanvasHeightChange}
            className="size-input"
          />
          <span>пикселей</span>
        </div>

        <Canvas 
          width={canvasWidth} 
          height={canvasHeight} 
          onPixelDataChange={handlePixelDataChange}
        />

        <PixelProcessor 
          pixelData={pixelData} 
          canvasWidth={canvasWidth} 
          canvasHeight={canvasHeight} 
        />

        <NeuralNetwork 
          pixelData={pixelData} 
          canvasWidth={canvasWidth} 
          canvasHeight={canvasHeight} 
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
