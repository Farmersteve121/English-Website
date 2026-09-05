import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TextReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [highlightedSentence, setHighlightedSentence] = useState(null);
  const audioRef = useRef(null);
  const { user } = useAuth();

  // 加载课文内容和进度
  useEffect(() => {
    const fetchText = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/texts/${id}`);
        setText(res.data);
        // 加载进度
        const progressRes = await axios.get('http://localhost:5000/api/words/progress');
        const textProgress = progressRes.data.textProgress?.find(p => p.textId === id);
        if (textProgress && audioRef.current) {
          audioRef.current.currentTime = textProgress.currentPosition || 0;
          setCurrentTime(textProgress.currentPosition || 0);
        }
      } catch (error) {
        alert('加载失败：' + error.message);
        navigate('/texts');
      }
    };
    fetchText();
  }, [id, navigate]);

  // 高亮当前句子（简单实现，基于时间）
  useEffect(() => {
    if (!text?.sentences || !audioRef.current) return;
    const time = audioRef.current.currentTime;
    const matched = text.sentences.findIndex(
      s => time >= s.startTime && time < (s.startTime + 5)
    );
    setHighlightedSentence(matched);
  }, [currentTime, text]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const saveProgress = async () => {
    if (!text) return;
    try {
      await axios.post(`http://localhost:5000/api/texts/progress/${text._id}`, {
        position: audioRef.current?.currentTime || 0,
        completed: audioRef.current?.currentTime >= (audioRef.current?.duration || 0) - 1
      });
    } catch (error) {
      console.error('保存进度失败:', error);
    }
  };

  // 每5秒自动保存进度
  useEffect(() => {
    const interval = setInterval(saveProgress, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!text) return <div>加载中...</div>;

  return (
    <div className="text-reader">
      <h2>{text.title}</h2>
      
      <div className="audio-controls">
        <button onClick={togglePlay}>
          {isPlaying ? '⏸ 暂停' : '▶ 播放'}
        </button>
        <input
          type="range"
          min="0"
          max={audioRef.current?.duration || 100}
          value={currentTime}
          onChange={(e) => {
            if (audioRef.current) {
              audioRef.current.currentTime = parseFloat(e.target.value);
              setCurrentTime(parseFloat(e.target.value));
            }
          }}
        />
        <span>{Math.floor(currentTime)}s</span>
      </div>

      <audio
        ref={audioRef}
        src={text.audioUrl}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onEnded={() => { setIsPlaying(false); saveProgress(); }}
      />

      <div className="text-content">
        {text.sentences && text.sentences.length > 0 ? (
          text.sentences.map((sentence, idx) => (
            <p key={idx} className={highlightedSentence === idx ? 'highlighted' : ''}>
              {sentence.text}
              <span className="translation">（{sentence.translation}）</span>
            </p>
          ))
        ) : (
          <p>{text.content}</p>
        )}
      </div>
    </div>
  );
};

export default TextReader;