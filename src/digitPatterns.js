// Генератор паттернов цифр для обучения нейросети

// Создание пустого поля
const createEmptyField = (width, height) => {
  return Array(height).fill().map(() => Array(width).fill(0));
};

// Рисование линии между двумя точками
const drawLine = (field, x1, y1, x2, y2) => {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  let x = x1;
  let y = y1;

  while (true) {
    if (x >= 0 && x < field[0].length && y >= 0 && y < field.length) {
      field[y][x] = 1;
    }

    if (x === x2 && y === y2) break;
    
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
};

// Рисование окружности
const drawCircle = (field, centerX, centerY, radius) => {
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[0].length; x++) {
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (Math.abs(distance - radius) <= 1) {
        field[y][x] = 1;
      }
    }
  }
};

// Рисование прямоугольника
const drawRect = (field, x1, y1, x2, y2) => {
  drawLine(field, x1, y1, x2, y1); // верх
  drawLine(field, x2, y1, x2, y2); // право
  drawLine(field, x2, y2, x1, y2); // низ
  drawLine(field, x1, y2, x1, y1); // лево
};

// Преобразование 2D массива в 1D
const flattenField = (field) => {
  return field.flat();
};

// Генерация паттерна цифры 0
const generateDigit0 = (width, height) => {
  const field = createEmptyField(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  
  drawCircle(field, centerX, centerY, radius);
  return flattenField(field);
};

// Генерация паттерна цифры 1
const generateDigit1 = (width, height) => {
  const field = createEmptyField(width, height);
  const centerX = width / 2;
  
  // Вертикальная линия
  drawLine(field, centerX, height * 0.2, centerX, height * 0.8);
  
  // Верхняя наклонная линия
  drawLine(field, centerX - width * 0.15, height * 0.3, centerX, height * 0.2);
  
  // Нижняя горизонтальная линия
  drawLine(field, centerX - width * 0.1, height * 0.8, centerX + width * 0.1, height * 0.8);
  
  return flattenField(field);
};

// Генерация паттерна цифры 2
const generateDigit2 = (width, height) => {
  const field = createEmptyField(width, height);
  
  // Верхняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
  
  // Правая вертикальная линия (верхняя часть)
  drawLine(field, width * 0.8, height * 0.2, width * 0.8, height * 0.5);
  
  // Средняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
  
  // Левая вертикальная линия (нижняя часть)
  drawLine(field, width * 0.2, height * 0.5, width * 0.2, height * 0.8);
  
  // Нижняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.8, width * 0.8, height * 0.8);
  
  return flattenField(field);
};

// Генерация паттерна цифры 3
const generateDigit3 = (width, height) => {
  const field = createEmptyField(width, height);
  
  // Верхняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
  
  // Средняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
  
  // Нижняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.8, width * 0.8, height * 0.8);
  
  // Правая вертикальная линия
  drawLine(field, width * 0.8, height * 0.2, width * 0.8, height * 0.8);
  
  return flattenField(field);
};

// Генерация паттерна цифры 4
const generateDigit4 = (width, height) => {
  const field = createEmptyField(width, height);
  
  // Левая вертикальная линия (верхняя часть)
  drawLine(field, width * 0.2, height * 0.2, width * 0.2, height * 0.5);
  
  // Средняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
  
  // Правая вертикальная линия
  drawLine(field, width * 0.8, height * 0.2, width * 0.8, height * 0.8);
  
  return flattenField(field);
};

// Генерация паттерна цифры 5
const generateDigit5 = (width, height) => {
  const field = createEmptyField(width, height);
  
  // Верхняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
  
  // Левая вертикальная линия (верхняя часть)
  drawLine(field, width * 0.2, height * 0.2, width * 0.2, height * 0.5);
  
  // Средняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
  
  // Правая вертикальная линия (нижняя часть)
  drawLine(field, width * 0.8, height * 0.5, width * 0.8, height * 0.8);
  
  // Нижняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.8, width * 0.8, height * 0.8);
  
  return flattenField(field);
};

// Генерация паттерна цифры 6
const generateDigit6 = (width, height) => {
  const field = createEmptyField(width, height);
  
  // Верхняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
  
  // Левая вертикальная линия
  drawLine(field, width * 0.2, height * 0.2, width * 0.2, height * 0.8);
  
  // Средняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
  
  // Правая вертикальная линия (нижняя часть)
  drawLine(field, width * 0.8, height * 0.5, width * 0.8, height * 0.8);
  
  // Нижняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.8, width * 0.8, height * 0.8);
  
  return flattenField(field);
};

// Генерация паттерна цифры 7
const generateDigit7 = (width, height) => {
  const field = createEmptyField(width, height);
  
  // Верхняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
  
  // Правая вертикальная линия
  drawLine(field, width * 0.8, height * 0.2, width * 0.8, height * 0.8);
  
  return flattenField(field);
};

// Генерация паттерна цифры 8
const generateDigit8 = (width, height) => {
  const field = createEmptyField(width, height);
  
  // Верхняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
  
  // Средняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
  
  // Нижняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.8, width * 0.8, height * 0.8);
  
  // Левая вертикальная линия
  drawLine(field, width * 0.2, height * 0.2, width * 0.2, height * 0.8);
  
  // Правая вертикальная линия
  drawLine(field, width * 0.8, height * 0.2, width * 0.8, height * 0.8);
  
  return flattenField(field);
};

// Генерация паттерна цифры 9
const generateDigit9 = (width, height) => {
  const field = createEmptyField(width, height);
  
  // Верхняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.2, width * 0.8, height * 0.2);
  
  // Средняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.5, width * 0.8, height * 0.5);
  
  // Нижняя горизонтальная линия
  drawLine(field, width * 0.2, height * 0.8, width * 0.8, height * 0.8);
  
  // Левая вертикальная линия (верхняя часть)
  drawLine(field, width * 0.2, height * 0.2, width * 0.2, height * 0.5);
  
  // Правая вертикальная линия
  drawLine(field, width * 0.8, height * 0.2, width * 0.8, height * 0.8);
  
  return flattenField(field);
};

// Создание вариантов цифры с небольшими вариациями
const createVariations = (basePattern, width, height, count = 3) => {
  const variations = [basePattern];
  
  for (let i = 1; i < count; i++) {
    const field = createEmptyField(width, height);
    const variation = basePattern.slice();
    
    // Добавляем небольшие случайные изменения
    for (let j = 0; j < variation.length; j++) {
      if (Math.random() < 0.05) { // 5% шанс изменения
        variation[j] = variation[j] === 1 ? 0 : 1;
      }
    }
    
    variations.push(variation);
  }
  
  return variations;
};

// Экспорт всех генераторов
export const digitGenerators = {
  0: generateDigit0,
  1: generateDigit1,
  2: generateDigit2,
  3: generateDigit3,
  4: generateDigit4,
  5: generateDigit5,
  6: generateDigit6,
  7: generateDigit7,
  8: generateDigit8,
  9: generateDigit9
};

// Создание обучающих данных для всех цифр
export const generateTrainingData = (width = 30, height = 30, variationsPerDigit = 5) => {
  const trainingData = [];
  
  for (let digit = 0; digit <= 9; digit++) {
    const basePattern = digitGenerators[digit](width, height);
    const variations = createVariations(basePattern, width, height, variationsPerDigit);
    
    variations.forEach(pattern => {
      trainingData.push({
        input: pattern,
        target: digit
      });
    });
  }
  
  return trainingData;
};
