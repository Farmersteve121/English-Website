const mongoose = require('mongoose');
const WordSchema = new mongoose.Schema({
  unit: Number,
  word: String,
  phonetic: String,
  translation: String,
  example: String,
  exampleTranslation: String,
  partOfSpeech: String
});
module.exports = mongoose.model('Word', WordSchema);