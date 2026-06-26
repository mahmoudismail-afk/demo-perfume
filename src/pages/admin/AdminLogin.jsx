import React, { useState } from 'react';
import { Lock, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        if (data.token) {
          localStorage.setItem('adminToken', data.token);
        }
        onLogin();
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <Link to="/" className="back-store-link" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light)', textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <div className="admin-login-logo">
            <span className="logo-icon">꩜</span>
            <h2>Admin Dashboard</h2>
          </div>
          <p className="subtitle">Sign in to access your management tools.</p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-wrapper">
            <User size={18} className="admin-input-icon" />
            <input 
              type="text" 
              placeholder="Admin Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="admin-input-wrapper">
            <Lock size={18} className="admin-input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-primary admin-login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
