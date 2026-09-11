import { useState } from 'react';
import axios from 'axios';
import API_BASE from '../../api';

const MemoForm = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [intervalHours, setIntervalHours] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('标题不能为空');
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/memos`, {
        title,
        content,
        reminderIntervalHours: parseFloat(intervalHours)
      });
      setTitle('');
      setContent('');
      setIntervalHours(1);
      onCreated?.();
    } catch (error) {
      alert('创建失败：' + (error.response?.data?.error || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="memo-form" onSubmit={handleSubmit}>
      <h3>➕ 新建备忘录</h3>
      <input
        type="text"
        placeholder="标题（必填）"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="内容（可选）"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows="3"
      />
      <div className="interval-row">
        <label>提醒间隔（小时）：</label>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={intervalHours}
          onChange={e => setIntervalHours(e.target.value)}
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? '提交中...' : '创建'}
      </button>
    </form>
  );
};

export default MemoForm;