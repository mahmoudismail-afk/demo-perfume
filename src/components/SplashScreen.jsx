import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ data }) => {
  const [isVisible, setIsVisible] = useState(() => {
    return !sessionStorage.getItem('hasSeenSplash');
  });

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('hasSeenSplash', 'true');
    }, 2500); // Wait for 2.5 seconds before fading out

    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${isVisible ? '' : 'fade-out'}`}>
      <div className="splash-content">
        <div className="splash-logo-icon">꩜</div>
        <h1 className="splash-title">{data.name}</h1>
        <p className="splash-subtitle">{data.tagline}</p>
      </div>
    </div>
  );
};

export default SplashScreen;
