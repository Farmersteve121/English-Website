const router = require('express').Router();
const PushSubscription = require('../models/PushSubscription');
const { authenticate } = require('../middleware/auth');

// 保存推送订阅
router.post('/subscribe', authenticate, async (req, res) => {
  try {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: '无效的订阅' });
    }
    
    // 删除旧的（同一 endpoint），避免重复
    await PushSubscription.deleteMany({ 
      userId: req.user._id, 
      'subscription.endpoint': subscription.endpoint 
    });
    
    await PushSubscription.create({ userId: req.user._id, subscription });
    res.status(201).json({ message: '订阅成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取 VAPID 公钥（前端订阅时需要）
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

module.exports = router;