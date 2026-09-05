import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TextList = () => {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/texts');
        setTexts(res.data);
      } catch (error) {
        console.error('获取课文失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTexts();
  }, []);

  if (loading) return <div>加载课文中...</div>;

  return (
    <div className="text-list">
      <h1>📚 课文聆听</h1>
      <ul>
        {texts.map(text => (
          <li key={text._id}>
            <Link to={`/texts/${text._id}`}>
              Unit {text.unit} - {text.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TextList;