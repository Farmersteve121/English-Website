const mongoose = require('mongoose');
const Word = require('../models/Word');
const Text = require('../models/Text');
const wordsData = require('../data/words.json');
const textsData = require('../data/texts.json');

mongoose.connect('mongodb://localhost:27017/english_learning');

const seed = async () => {
  try {
    await Word.deleteMany({});
    await Text.deleteMany({});
    await Word.insertMany(wordsData);
    await Text.insertMany(textsData);
    console.log('✅ 数据导入成功！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 导入失败:', error);
    process.exit(1);
  }
};
seed();