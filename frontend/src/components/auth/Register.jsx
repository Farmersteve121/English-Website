import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password, role);
      navigate('/');
    } catch (error) {
      alert('注册失败：' + error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>注册</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="用户名" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="邮箱" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="密码" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="student">学生</option>
          <option value="teacher">教师</option>
          <option value="admin">管理员</option>
        </select>
        <button type="submit">注册</button>
      </form>
    </div>
  );
};

export default Register;