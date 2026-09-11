const cron = require('node-cron');
const webpush = require('web-push');
const Memo = require('../models/Memo');
const PushSubscription = require('../models/PushSubscription');

function initReminderService() {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.warn('⚠️ VAPID 密钥未配置，推送功能将不可用');
    return;
  }
  
  webpush.setVapidDetails(
    'mailto:your-email@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  
  // 每 10 分钟检查一次
  cron.schedule('*/10 * * * *', async () => {
    try {
      const now = new Date();
      const memos = await Memo.find({ completed: false });
      
      for (const memo of memos) {
        const intervalMs = (memo.reminderIntervalHours || 1) * 60 * 60 * 1000;
        const lastNotified = memo.lastNotifiedAt || memo.createdAt;
        
        if (now - lastNotified < intervalMs) continue;
        
        // 该提醒了
        const subs = await PushSubscription.find({ userId: memo.userId });
        for (const sub of subs) {
          try {
            await webpush.sendNotification(
              sub.subscription,
              JSON.stringify({
                title: '📝 备忘录提醒',
                body: memo.title,
                memoId: memo._id.toString()
              })
            );
          } catch (err) {
            if (err.statusCode === 410 || err.statusCode === 404) {
              // 订阅失效，删除
              await PushSubscription.deleteOne({ _id: sub._id });
            } else {
              console.error('推送失败:', err.message);
            }
          }
        }
        
        memo.lastNotifiedAt = now;
        await memo.save();
      }
    } catch (err) {
      console.error('提醒任务出错:', err);
    }
  });
  
  console.log('✅ 提醒服务已启动（每10分钟检查一次）');
}

module.exports = { initReminderService };