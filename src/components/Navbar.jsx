import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User, Menu } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Navbar.css';

const Navbar = ({ data }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen, wishlistItems, setIsWishlistOpen, setIsAuthOpen, isAuthenticated, logout } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-logo" onClick={() => navigate('/')}>
            <span className="logo-icon">꩜</span>
            <span className="logo-text">{data.name}</span>
          </div>
          
          <div className="navbar-actions">
            <button aria-label="Wishlist" className="icon-badge-container" onClick={() => setIsWishlistOpen(true)}>
              <Heart size={20} fill={wishlistItems.length > 0 ? "var(--color-white)" : "none"} />
              {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
            </button>
            <button aria-label="Cart" className="icon-badge-container" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
            {isAuthenticated ? (
              <button aria-label="Sign Out" onClick={logout} title="Sign Out">
                <User size={20} fill="var(--color-white)" />
              </button>
            ) : (
              <button aria-label="Sign In" onClick={() => setIsAuthOpen(true)} title="Sign In">
                <User size={20} />
              </button>
            )}
            <button aria-label="Menu" onClick={() => setIsMenuOpen(true)}><Menu size={24} /></button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', 
          backgroundColor: 'rgba(5,5,5,0.98)', zIndex: 9999, display: 'flex', 
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <button 
            onClick={() => setIsMenuOpen(false)}
            style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}
          >
            ×
          </button>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <li><button onClick={() => handleNavClick('home')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '2rem', fontFamily: 'var(--font-serif)', cursor: 'pointer' }}>Home</button></li>
            <li><button onClick={() => handleNavClick('products')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '2rem', fontFamily: 'var(--font-serif)', cursor: 'pointer' }}>Shop</button></li>
            <li><button onClick={() => handleNavClick('about')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '2rem', fontFamily: 'var(--font-serif)', cursor: 'pointer' }}>Our Story</button></li>
            <li><button onClick={() => handleNavClick('contact')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '2rem', fontFamily: 'var(--font-serif)', cursor: 'pointer' }}>Contact</button></li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
