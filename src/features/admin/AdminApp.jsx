import { useEffect, useState } from 'react';
import AdminLogin from './components/AdminLogin.jsx';
import Dashboard from './components/Dashboard.jsx';
import { clearToken, getToken } from './api/adminApi';
import './admin.css';

// Reachable only by typing /admin — nothing in the public site links here.
export default function AdminApp() {
  const [authed, setAuthed] = useState(() => !!getToken());

  useEffect(() => {
    document.title = 'Admin';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const logout = () => {
    clearToken();
    setAuthed(false);
  };

  return authed ? <Dashboard onLogout={logout} /> : <AdminLogin onLogin={() => setAuthed(true)} />;
}
