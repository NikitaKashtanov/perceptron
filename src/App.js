import React, { useState } from 'react';
import Canvas from './components/Canvas/Canvas';
import PixelProcessor from './components/PixelProcessor/PixelProcessor';
import NeuralNetwork from './components/NeuralNetwork/NeuralNetwork';
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
        <h1>Neural Network for Character Recognition</h1>
        <p>Draw digits on the canvas and analyze pixel data</p>
        
        <div className="canvas-size-control">
          <label htmlFor="canvas-width">Canvas Width: </label>
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
          <label htmlFor="canvas-height">Canvas Height: </label>
          <input
            id="canvas-height"
            type="number"
            min="20"
            max="60"
            value={canvasHeight}
            onChange={handleCanvasHeightChange}
            className="size-input"
          />
          <span>pixels</span>
        </div>

        <Canvas 
          width={canvasWidth} 
          height={canvasHeight} 
          onPixelDataChange={handlePixelDataChange}
        />

        <NeuralNetwork 
          pixelData={pixelData} 
          canvasWidth={canvasWidth} 
          canvasHeight={canvasHeight} 
        />

        <PixelProcessor 
          pixelData={pixelData} 
          canvasWidth={canvasWidth} 
          canvasHeight={canvasHeight} 
        />

        <div className="info-section">
          <h3>Usage Instructions:</h3>
          <ul>
            <li><strong>Drawing:</strong> Draw digits with your mouse on the canvas</li>
            <li><strong>Training:</strong> Enable training mode, enter a digit (0-9) and click "Train"</li>
            <li><strong>Recognition:</strong> Exit training mode - the neural network will automatically recognize digits</li>
            <li><strong>Settings:</strong> Adjust canvas size and learning rate</li>
            <li><strong>Saving:</strong> Weights are automatically saved to localStorage</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
