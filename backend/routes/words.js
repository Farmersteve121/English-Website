const router = require('express').Router();
const Word = require('../models/Word');
const Progress = require('../models/Progress');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const { unit } = req.query;
    const filter = unit ? { unit: parseInt(unit) } : {};
    const words = await Word.find(filter).sort({ unit: 1 });
    res.json(words);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/progress', authenticate, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = new Progress({ userId: req.user._id, wordProgress: [], textProgress: [] });
    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/progress/:wordId', authenticate, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = new Progress({ userId: req.user._id, wordProgress: [], textProgress: [] });
    const existing = progress.wordProgress.find(p => p.wordId.toString() === req.params.wordId);
    if (existing) {
      existing.mastered = true;
      existing.reviewCount += 1;
      existing.lastReviewed = new Date();
    } else {
      progress.wordProgress.push({ wordId: req.params.wordId, mastered: true, reviewCount: 1, lastReviewed: new Date() });
    }
    progress.updatedAt = new Date();
    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;