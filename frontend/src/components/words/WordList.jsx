import { useState, useEffect } from 'react';
import axios from 'axios';
import WordCard from './WordCard';

const WordList = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/words');
      setWords(res.data);
    } catch (error) {
      console.error('获取单词失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>加载单词中...</div>;

  return (
    <div className="word-list">
      <h1>📖 背单词</h1>
      <div className="word-grid">
        {words.map(word => (
          <WordCard key={word._id} word={word} onProgressUpdate={fetchWords} />
        ))}
      </div>
    </div>
  );
};

export default WordList;