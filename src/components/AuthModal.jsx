import React, { useState } from 'react';
import { X, Lock, User, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './AuthModal.css';

const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen, loadCustomerProfile } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: ''
  });
  
  if (!isAuthOpen) return null;

  const handleClose = () => {
    setIsAuthOpen(false);
    setTimeout(() => {
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        password: ''
      });
      setErrorMsg('');
      setIsLogin(true);
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const storeToken = (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
      loadCustomerProfile(token); // Update the global state with new token
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // Login Flow
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formData.phone, password: formData.password })
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          storeToken(data.token);
          handleClose();
        } else {
          setErrorMsg(data.error || 'Invalid credentials.');
        }
      } else {
        // Signup Flow
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          storeToken(data.token);
          handleClose();
        } else {
          setErrorMsg(data.error || 'Signup failed. Please try again.');
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.phone) {
      setErrorMsg('Please enter your phone number first.');
      return;
    }
    try {
      const response = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to send reset link.');
      } else {
        setErrorMsg('Reset link sent to your phone!');
      }
    } catch (err) {
      setErrorMsg('Network error.');
    }
  };

  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={handleClose} type="button">
          <X size={24} />
        </button>

        <div className="auth-header">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--color-text-light)' }}>
            {isLogin 
              ? 'Sign in to access your orders and wishlist.' 
              : 'Join us to save your favorite fragrances.'}
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-msg" style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #f87171', fontSize: '0.9rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <div className="auth-tabs">
          <button 
            type="button"
            className={`auth-tab ${isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
          >
            Login
          </button>
          <button 
            type="button"
            className={`auth-tab ${!isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-input-group row">
              <div className="auth-input-wrapper">
                <User size={18} className="auth-icon" />
                <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-icon" />
                <input type="text" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>
          )}

          <div className="auth-input-wrapper">
            <Phone size={18} className="auth-icon" />
            <input 
              type="tel" 
              name="phone"
              placeholder="Phone Number" 
              value={formData.phone}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-icon" />
            <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleInputChange} />
          </div>

          {isLogin && (
            <div className="auth-forgot-password">
              <a href="#" onClick={handleForgotPassword}>Forgot your password?</a>
            </div>
          )}

          <button type="submit" className="btn-primary auth-submit" disabled={isSubmitting}>
            {isSubmitting 
              ? 'Processing...' 
              : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setErrorMsg(''); }}>
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
