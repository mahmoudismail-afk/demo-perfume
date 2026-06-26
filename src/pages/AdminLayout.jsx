import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Users, Tag, ArrowLeft, LogOut } from 'lucide-react';
import AdminLogin from './admin/AdminLogin';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return localStorage.getItem('isAdminAuth') === 'true';
  });

  const handleLogin = () => {
    setIsAdminAuth(true);
    localStorage.setItem('isAdminAuth', 'true');
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    localStorage.removeItem('isAdminAuth');
  };

  if (!isAdminAuth) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const navItems = [
    { path: '/admin', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/admin/inventory', icon: <Package size={20} />, label: 'Inventory' },
    { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
    { path: '/admin/customers', icon: <Users size={20} />, label: 'Customers' },
    { path: '/admin/promotions', icon: <Tag size={20} />, label: 'Promotions' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="back-store-link">
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <h2>Dashboard</h2>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="admin-nav-item" 
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', marginTop: 'auto', color: '#ef4444' }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
