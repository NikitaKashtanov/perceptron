// Скрипт для обучения нейросети и обновления trainedModel.json

import { trainNeuralNetwork } from './src/neuralNetworkTrainer.js';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🧠 Обучение нейросети для распознавания цифр...');
  console.log('📏 Размер канваса: 30x30 пикселей');
  console.log('🎯 Цель: создать предобученную модель для всех цифр 0-9');
  console.log('');

  try {
    // Обучаем модель
    const trainedModel = await trainNeuralNetwork(30);
    
    // Сохраняем в файл
    const modelPath = path.join(process.cwd(), 'public', 'trainedModel.json');
    fs.writeFileSync(modelPath, JSON.stringify(trainedModel, null, 2));
    
    console.log('');
    console.log('✅ Обучение завершено успешно!');
    console.log(`📁 Модель сохранена в: ${modelPath}`);
    console.log(`📊 Точность: ${trainedModel.metadata.description}`);
    console.log(`📈 Примеров обучения: ${trainedModel.metadata.trainingExamples}`);
    console.log('');
    console.log('🚀 Теперь можно использовать предобученную модель в приложении!');
    
  } catch (error) {
    console.error('❌ Ошибка при обучении:', error);
    process.exit(1);
  }
}

// Запускаем обучение
main();
