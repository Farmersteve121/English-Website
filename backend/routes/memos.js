const router = require('express').Router();
const Memo = require('../models/Memo');
const { authenticate } = require('../middleware/auth');

// 获取当前用户所有备忘录
router.get('/', authenticate, async (req, res) => {
  try {
    const memos = await Memo.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(memos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 新建备忘录
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, reminderIntervalHours } = req.body;
    if (!title) return res.status(400).json({ error: '标题不能为空' });
    
    const memo = new Memo({
      userId: req.user._id,
      title,
      content: content || '',
      reminderIntervalHours: reminderIntervalHours || 1
    });
    await memo.save();
    res.status(201).json(memo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 标记完成
router.patch('/:id/complete', authenticate, async (req, res) => {
  try {
    const memo = await Memo.findOne({ _id: req.params.id, userId: req.user._id });
    if (!memo) return res.status(404).json({ error: '备忘录不存在' });
    
    memo.completed = true;
    memo.completedAt = new Date();
    await memo.save();
    res.json(memo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 取消完成（重新激活）
router.patch('/:id/uncomplete', authenticate, async (req, res) => {
  try {
    const memo = await Memo.findOne({ _id: req.params.id, userId: req.user._id });
    if (!memo) return res.status(404).json({ error: '备忘录不存在' });
    
    memo.completed = false;
    memo.completedAt = null;
    memo.lastNotifiedAt = null;
    await memo.save();
    res.json(memo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除备忘录
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await Memo.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ error: '备忘录不存在' });
    res.json({ message: '已删除' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;