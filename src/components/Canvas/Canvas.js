import React, { useRef, useEffect, useState, useCallback } from 'react';
import './Canvas.css';

const Canvas = ({ width = 100, height = 100, onPixelDataChange }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixelData, setPixelData] = useState(null);

  // Инициализация канваса
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем размеры канваса
    canvas.width = width;
    canvas.height = height;
    
    // Заливаем белым цветом
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Настраиваем стили для рисования
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.max(1, Math.floor(width / 50)); // Адаптивная толщина линии
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = false; // Отключаем сглаживание для четких пикселей
  }, [width, height]);

  // Функция получения пиксельных данных
  const getPixelData = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    
    // Преобразуем в массив 0 и 1 (черный/белый)
    const binaryPixels = [];
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      
      // Если пиксель не белый (не 255,255,255), считаем его черным
      const isBlack = !(r === 255 && g === 255 && b === 255 && a === 255);
      binaryPixels.push(isBlack ? 1 : 0);
    }
    
    return binaryPixels;
  }, [width, height]);

  // Обновляем данные пикселей при изменении
  const updatePixelData = useCallback(() => {
    const data = getPixelData();
    setPixelData(data);
    if (onPixelDataChange) {
      onPixelDataChange(data);
    }
  }, [getPixelData, onPixelDataChange]);

  // Получение правильных координат с учетом масштабирования
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  // Начало рисования
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCanvasCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  // Рисование
  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCanvasCoordinates(e);
    
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  // Окончание рисования
  const stopDrawing = () => {
    setIsDrawing(false);
    updatePixelData();
  };

  // Очистка канваса
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    updatePixelData();
  };

  return (
    <div className="canvas-container">
      <h3>Canvas for Drawing Digits ({width}x{height})</h3>
      <div className="canvas-instructions">
        <small>💡 Рисуй без наклона, используй все поле (мы не умеем кадрировать)</small>
      </div>
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ width: `${width * 3}px`, height: `${height * 3}px` }}
      />
      <div className="canvas-controls">
        <button onClick={clearCanvas} className="clear-button">
          Clear
        </button>
        <button onClick={updatePixelData} className="analyze-button">
          Analyze
        </button>
      </div>
      <div className="pixel-info">
        <p>Pixels: {width * height}</p>
        <p>Black pixels: {pixelData ? pixelData.filter(p => p === 1).length : 0}</p>
      </div>
    </div>
  );
};

export default Canvas;
