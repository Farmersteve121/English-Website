const mongoose = require('mongoose');

const MemoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  reminderIntervalHours: { type: Number, default: 1 }, // 默认1小时提醒一次
  completed: { type: Boolean, default: false },
  completedAt: Date,
  lastNotifiedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Memo', MemoSchema);