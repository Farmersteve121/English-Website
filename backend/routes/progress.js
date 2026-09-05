const router = require('express').Router();
const Progress = require('../models/Progress');
const { authenticate } = require('../middleware/auth');

// 获取用户的所有学习进度
router.get('/', authenticate, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = new Progress({ userId: req.user._id, wordProgress: [], textProgress: [] });
      await progress.save();
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 重置所有进度（管理员功能）
router.delete('/reset', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '仅管理员可操作' });
    }
    await Progress.deleteMany({});
    res.json({ message: '所有进度已重置' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;