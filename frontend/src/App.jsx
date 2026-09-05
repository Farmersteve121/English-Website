import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import WordList from './components/words/WordList';
import TextList from './components/texts/TextList';
import TextReader from './components/texts/TextReader';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import './index.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="navbar">
      <Link to="/" className="logo">📚 英语学习</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/words">背单词</Link>
            <Link to="/texts">学课文</Link>
            {user.role === 'admin' && <Link to="/admin">管理后台</Link>}
            <span className="user-info">{user.username} ({user.role})</span>
            <button onClick={logout}>退出</button>
          </>
        ) : (
          <>
            <Link to="/login">登录</Link>
            <Link to="/register">注册</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/words" element={
              <ProtectedRoute><WordList /></ProtectedRoute>
            } />
            <Route path="/texts" element={
              <ProtectedRoute><TextList /></ProtectedRoute>
            } />
            <Route path="/texts/:id" element={
              <ProtectedRoute><TextReader /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <div className="home">
                  <h1>欢迎回来！</h1>
                  <p>选择上方菜单开始学习</p>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;