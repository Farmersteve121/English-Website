import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (error) {
      alert('注册失败：' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="auth-form">
      <h2>注册</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="email" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">注册</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        已有账号？<Link to="/login">去登录</Link>
      </p>
    </div>
  );
};

export default Register;