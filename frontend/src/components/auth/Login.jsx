import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      alert('登录失败：' + error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>登录</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="用户名" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="密码" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">登录</button>
      </form>
    </div>
  );
};

export default Login;