import React from 'react';
import './Hero.css';

const Hero = ({ data }) => {
  return (
    <section className="hero">
      <div className="hero-background">
        <img src={data.backgroundImage} alt="Hero Background" />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content fade-in-section is-visible">
        <div className="hero-logo-large">꩜</div>
        <h1 className="hero-title">{data.site.name}</h1>
        <p className="hero-subtitle">{data.site.fullName}</p>
        <div className="hero-tagline-container">
           <p className="hero-tagline">{data.site.tagline}</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
