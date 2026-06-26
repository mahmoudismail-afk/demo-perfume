import React, { useState } from 'react';
import { X, Lock, User, Phone, Key } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './AuthModal.css';

const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    password: ''
  });
  
  // OTP states
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  if (!isAuthOpen) return null;

  const handleClose = () => {
    setIsAuthOpen(false);
    setTimeout(() => {
      setOtpStep(false);
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        phone: '',
        password: ''
      });
      setOtpCode('');
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
          body: JSON.stringify({ username: formData.username, password: formData.password })
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          storeToken(data.token);
          handleClose();
        } else {
          setErrorMsg(data.error || 'Invalid credentials.');
        }
      } else {
        // Signup & Verification Flow
        if (!otpStep) {
          // Trigger OTP
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          const data = await response.json();
          
          if (response.ok && data.success) {
            setOtpStep(true);
          } else {
            setErrorMsg(data.error || 'Signup failed. Please try again.');
          }
        } else {
          // Verify OTP
          if (otpCode.length < 4) {
            setErrorMsg('Please enter a valid OTP code.');
            setIsSubmitting(false);
            return;
          }
          
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: formData.phone, otpCode })
          });
          const data = await response.json();
          
          if (response.ok && data.success) {
            storeToken(data.token);
            handleClose();
          } else {
            setErrorMsg(data.error || 'Invalid OTP code.');
          }
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to resend OTP.');
      } else {
        setErrorMsg('OTP resent successfully!'); // using errorMsg for UI feedback
      }
    } catch (err) {
      setErrorMsg('Network error.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.username) {
      setErrorMsg('Please enter your username first.');
      return;
    }
    try {
      const response = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to send reset link.');
      } else {
        setErrorMsg('Reset link sent!');
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
            {isLogin ? 'Welcome Back' : (otpStep ? 'Verify Phone' : 'Create Account')}
          </h2>
          <p style={{ color: 'var(--color-text-light)' }}>
            {isLogin 
              ? 'Sign in to access your orders and wishlist.' 
              : (otpStep 
                  ? `Enter the OTP sent to ${formData.phone}` 
                  : 'Join us to save your favorite fragrances.')}
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-msg" style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #f87171', fontSize: '0.9rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        {!otpStep && (
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
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {otpStep ? (
            <div className="auth-input-wrapper">
              <Key size={18} className="auth-icon" />
              <input 
                type="text" 
                placeholder="Enter OTP Code" 
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                maxLength="6"
                required 
                style={{ letterSpacing: '0.25em', textAlign: 'center', paddingLeft: '1rem' }}
              />
            </div>
          ) : (
            <>
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
                <User size={18} className="auth-icon" />
                <input type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleInputChange} />
              </div>

              {!isLogin && (
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
              )}

              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-icon" />
                <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleInputChange} />
              </div>

              {isLogin && (
                <div className="auth-forgot-password">
                  <a href="#" onClick={handleForgotPassword}>Forgot your password?</a>
                </div>
              )}
            </>
          )}

          <button type="submit" className="btn-primary auth-submit" disabled={isSubmitting}>
            {isSubmitting 
              ? 'Processing...' 
              : (isLogin ? 'Sign In' : (otpStep ? 'Verify & Create Account' : 'Sign Up'))}
          </button>
        </form>

        {!otpStep && (
          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setErrorMsg(''); }}>
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </a>
            </p>
          </div>
        )}
        
        {otpStep && (
          <div className="auth-footer">
            <p>
              Didn't receive the code?{' '}
              <a href="#" onClick={handleResendOTP}>
                Resend OTP
              </a>
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setOtpStep(false); setErrorMsg(''); }}>
                Change Phone Number
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
