import axios from 'axios';
import API_BASE from '../../api';

const MemoItem = ({ memo, onUpdate }) => {
  const handleComplete = async () => {
    try {
      await axios.patch(`${API_BASE}/memos/${memo._id}/complete`);
      onUpdate?.();
    } catch (error) {
      alert('操作失败：' + error.message);
    }
  };

  const handleUncomplete = async () => {
    try {
      await axios.patch(`${API_BASE}/memos/${memo._id}/uncomplete`);
      onUpdate?.();
    } catch (error) {
      alert('操作失败：' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定删除这条备忘录？')) return;
    try {
      await axios.delete(`${API_BASE}/memos/${memo._id}`);
      onUpdate?.();
    } catch (error) {
      alert('删除失败：' + error.message);
    }
  };

  const nextReminderTime = () => {
    if (memo.completed) return null;
    const last = memo.lastNotifiedAt || memo.createdAt;
    const next = new Date(new Date(last).getTime() + memo.reminderIntervalHours * 3600 * 1000);
    return next.toLocaleString();
  };

  return (
    <div className={`memo-item ${memo.completed ? 'completed' : ''}`}>
      <div className="memo-header">
        <h4>{memo.title}</h4>
        <span className={`status ${memo.completed ? 'done' : 'pending'}`}>
          {memo.completed ? '✅ 已完成' : '⏳ 进行中'}
        </span>
      </div>
      {memo.content && <p className="memo-content">{memo.content}</p>}
      <div className="memo-meta">
        <span>提醒间隔：{memo.reminderIntervalHours} 小时</span>
        {!memo.completed && nextReminderTime() && (
          <span>下次提醒：{nextReminderTime()}</span>
        )}
        <span>创建于：{new Date(memo.createdAt).toLocaleString()}</span>
      </div>
      <div className="memo-actions">
        {!memo.completed ? (
          <button onClick={handleComplete} className="btn-done">标记完成</button>
        ) : (
          <button onClick={handleUncomplete} className="btn-undone">恢复未完成</button>
        )}
        <button onClick={handleDelete} className="btn-delete">删除</button>
      </div>
    </div>
  );
};

export default MemoItem;