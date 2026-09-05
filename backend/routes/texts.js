const router = require('express').Router();
const Text = require('../models/Text');
const Progress = require('../models/Progress');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const texts = await Text.find().sort({ unit: 1 });
    res.json(texts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const text = await Text.findById(req.params.id);
    if (!text) return res.status(404).json({ error: '课文不存在' });
    res.json(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/progress/:textId', authenticate, async (req, res) => {
  try {
    const { position, completed } = req.body;
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = new Progress({ userId: req.user._id, wordProgress: [], textProgress: [] });
    const existing = progress.textProgress.find(p => p.textId.toString() === req.params.textId);
    if (existing) {
      existing.currentPosition = position || existing.currentPosition;
      existing.completed = completed || existing.completed;
    } else {
      progress.textProgress.push({ textId: req.params.textId, currentPosition: position || 0, completed: completed || false });
    }
    progress.updatedAt = new Date();
    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;