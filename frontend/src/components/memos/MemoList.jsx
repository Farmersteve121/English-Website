import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../../api';
import MemoForm from './MemoForm';
import MemoItem from './MemoItem';

const MemoList = () => {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all / pending / completed
  const [pushEnabled, setPushEnabled] = useState(false);

  const fetchMemos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/memos`);
      setMemos(res.data);
    } catch (error) {
      console.error('获取备忘录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemos();
    setupPush();
  }, []);

  // 注册 Service Worker + 订阅推送
  const setupPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('浏览器不支持推送');
      return;
    }
    try {
      const reg = await navigator.serviceWorker.register('/English-Website/sw.js');
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('用户拒绝了通知权限');
        return;
      }

      // 获取 VAPID 公钥
      const keyRes = await axios.get(`${API_BASE}/push/vapid-public-key`);
      const vapidPublicKey = keyRes.data.publicKey;
      if (!vapidPublicKey) return;

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      await axios.post(`${API_BASE}/push/subscribe`, subscription);
      setPushEnabled(true);
      console.log('✅ 推送订阅成功');
    } catch (err) {
      console.error('推送订阅失败:', err);
    }
  };

  const filteredMemos = memos.filter(m => {
    if (filter === 'pending') return !m.completed;
    if (filter === 'completed') return m.completed;
    return true;
  });

  if (loading) return <div>加载中...</div>;

  return (
    <div className="memo-page">
      <h1>📝 我的备忘录</h1>
      {pushEnabled && (
        <p className="push-status">✅ 桌面提醒已开启，未完成的备忘会按设定间隔提醒你</p>
      )}
      <MemoForm onCreated={fetchMemos} />

      <div className="filter-bar">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          全部 ({memos.length})
        </button>
        <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>
          进行中 ({memos.filter(m => !m.completed).length})
        </button>
        <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>
          已完成 ({memos.filter(m => m.completed).length})
        </button>
      </div>

      <div className="memo-list">
        {filteredMemos.length === 0 ? (
          <p className="empty">暂无备忘录</p>
        ) : (
          filteredMemos.map(memo => (
            <MemoItem key={memo._id} memo={memo} onUpdate={fetchMemos} />
          ))
        )}
      </div>
    </div>
  );
};

// VAPID 公钥转 Uint8Array（订阅推送需要）
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default MemoList;