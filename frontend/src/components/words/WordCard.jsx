import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const WordCard = ({ word, onProgressUpdate }) => {
  const [flipped, setFlipped] = useState(false);
  const { user } = useAuth();

  const handleMarkLearned = async () => {
    try {
      await axios.post(`http://localhost:5000/api/words/progress/${word._id}`);
      onProgressUpdate?.();
    } catch (error) {
      console.error('更新进度失败:', error);
    }
  };

  return (
    <div className="word-card" onClick={() => setFlipped(!flipped)}>
      {!flipped ? (
        <div className="word-front">
          <h2>{word.word}</h2>
          <p className="phonetic">{word.phonetic}</p>
          <p className="hint">点击翻转查看释义</p>
        </div>
      ) : (
        <div className="word-back">
          <h3>{word.translation}</h3>
          <p className="part-of-speech">{word.partOfSpeech}</p>
          {word.example && <p className="example">例句：{word.example}</p>}
          <button onClick={(e) => { e.stopPropagation(); handleMarkLearned(); }}>
            ✓ 已掌握
          </button>
        </div>
      )}
    </div>
  );
};

export default WordCard;