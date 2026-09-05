import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="admin-dashboard">
      <h1>管理员后台</h1>
      <p>欢迎，{user?.username}！</p>
      <p>此处可管理用户、单词和课文数据（待扩展）</p>
    </div>
  );
};

export default AdminDashboard;