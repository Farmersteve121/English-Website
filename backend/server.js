require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { initReminderService } = require('./services/reminder');

const app = express();
app.use(cors());
app.use(express.json());

// 数据库连接（用环境变量；本地开发用 fallback）
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/memo_app';
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/memos', require('./routes/memos'));
app.use('/api/push', require('./routes/push'));

// 启动提醒服务
initReminderService();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));