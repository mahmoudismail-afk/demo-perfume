import React from 'react';
import './Footer.css';

const Footer = ({ data }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">꩜</span>
              <span className="logo-text">{data.site.name}</span>
            </div>
            <p className="footer-tagline">{data.site.footerText}</p>
          </div>
          
          <div className="footer-links-group">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              {data.navigation.main.map((link, index) => (
                <li key={index}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h4 className="footer-heading">Collections</h4>
            <ul className="footer-links">
              {data.navigation.collections.map((link, index) => (
                <li key={index}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {data.site.fullName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
