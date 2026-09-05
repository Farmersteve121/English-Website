const mongoose = require('mongoose');
const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wordProgress: [{
    wordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Word' },
    mastered: { type: Boolean, default: false },
    reviewCount: { type: Number, default: 0 },
    lastReviewed: Date
  }],
  textProgress: [{
    textId: { type: mongoose.Schema.Types.ObjectId, ref: 'Text' },
    currentPosition: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
  }],
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Progress', ProgressSchema);