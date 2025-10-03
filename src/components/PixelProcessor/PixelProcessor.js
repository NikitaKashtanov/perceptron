import React, { useState } from 'react';
import './PixelProcessor.css';

const PixelProcessor = ({ pixelData, canvasWidth = 100, canvasHeight = 100 }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Функция анализа пиксельных данных
  const analyzePixels = () => {
    if (!pixelData) {
      setAnalysisResult('No data to analyze');
      return;
    }

    setIsProcessing(true);
    
    // Имитация обработки (здесь будет нейросеть)
    setTimeout(() => {
      const analysis = performPixelAnalysis(pixelData, canvasWidth, canvasHeight);
      setAnalysisResult(analysis);
      setIsProcessing(false);
    }, 500);
  };

  // Основная функция анализа пикселей
  const performPixelAnalysis = (pixels, width, height) => {
    const totalPixels = pixels.length;
    const blackPixels = pixels.filter(p => p === 1).length;
    const whitePixels = totalPixels - blackPixels;
    
    // Базовый анализ (пока без нейросети)
    const density = blackPixels / totalPixels;
    const centerOfMass = calculateCenterOfMass(pixels, width, height);
    const boundingBox = calculateBoundingBox(pixels, width, height);
    
    return {
      totalPixels,
      blackPixels,
      whitePixels,
      density: (density * 100).toFixed(2),
      centerOfMass,
      boundingBox,
      prediction: 'Analysis ready (neural network will be added)',
      confidence: 'N/A'
    };
  };

  // Вычисление центра масс
  const calculateCenterOfMass = (pixels, width, height) => {
    let totalX = 0, totalY = 0, count = 0;
    
    for (let i = 0; i < pixels.length; i++) {
      if (pixels[i] === 1) {
        const x = i % width;
        const y = Math.floor(i / width);
        totalX += x;
        totalY += y;
        count++;
      }
    }
    
    if (count === 0) return { x: 0, y: 0 };
    
    return {
      x: (totalX / count).toFixed(2),
      y: (totalY / count).toFixed(2)
    };
  };

  // Вычисление ограничивающего прямоугольника
  const calculateBoundingBox = (pixels, width, height) => {
    let minX = width, maxX = -1, minY = height, maxY = -1;
    
    for (let i = 0; i < pixels.length; i++) {
      if (pixels[i] === 1) {
        const x = i % width;
        const y = Math.floor(i / width);
        
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
    
    if (maxX === -1) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    };
  };

  // Визуализация пиксельных данных
  const renderPixelGrid = () => {
    if (!pixelData) return null;
    
    const gridSize = Math.min(20, Math.floor(200 / Math.max(canvasWidth, canvasHeight)));
    
    return (
      <div className="pixel-grid" style={{ 
        gridTemplateColumns: `repeat(${canvasWidth}, ${gridSize}px)`,
        gridTemplateRows: `repeat(${canvasHeight}, ${gridSize}px)`
      }}>
        {pixelData.map((pixel, index) => (
          <div
            key={index}
            className={`pixel ${pixel === 1 ? 'black' : 'white'}`}
            style={{ width: `${gridSize}px`, height: `${gridSize}px` }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="pixel-processor">
      <h3>Pixel Data Processing</h3>
      
      <div className="processor-controls">
        <button 
          onClick={analyzePixels} 
          disabled={!pixelData || isProcessing}
          className="process-button"
        >
          {isProcessing ? 'Processing...' : 'Analyze Pixels'}
        </button>
      </div>

      {pixelData && (
        <div className="data-visualization">
          <h4>Data Visualization ({canvasWidth}x{canvasHeight})</h4>
          <div className="pixel-preview">
            {renderPixelGrid()}
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="analysis-results">
          <h4>Analysis Results</h4>
          <div className="result-grid">
            <div className="result-item">
              <span className="label">Total Pixels:</span>
              <span className="value">{analysisResult.totalPixels}</span>
            </div>
            <div className="result-item">
              <span className="label">Black Pixels:</span>
              <span className="value">{analysisResult.blackPixels}</span>
            </div>
            <div className="result-item">
              <span className="label">Density:</span>
              <span className="value">{analysisResult.density}%</span>
            </div>
            <div className="result-item">
              <span className="label">Center of Mass:</span>
              <span className="value">({analysisResult.centerOfMass.x}, {analysisResult.centerOfMass.y})</span>
            </div>
            <div className="result-item">
              <span className="label">Bounds:</span>
              <span className="value">
                {analysisResult.boundingBox.width}x{analysisResult.boundingBox.height}
              </span>
            </div>
            <div className="result-item prediction">
              <span className="label">Prediction:</span>
              <span className="value">{analysisResult.prediction}</span>
            </div>
            <div className="result-item">
              <span className="label">Confidence:</span>
              <span className="value">{analysisResult.confidence}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PixelProcessor;
