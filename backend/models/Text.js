const mongoose = require('mongoose');
const TextSchema = new mongoose.Schema({
  unit: Number,
  title: String,
  content: String,
  translation: String,
  audioUrl: String,
  sentences: [{ text: String, translation: String, startTime: Number }]
});
module.exports = mongoose.model('Text', TextSchema);