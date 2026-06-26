import React from 'react';
import './About.css';

const About = ({ data }) => {
  return (
    <section className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text fade-in-section">
            <h2 className="heading-2 about-title">{data.title}</h2>
            {data.paragraphs.map((para, index) => (
              <p key={index} className="about-paragraph">{para}</p>
            ))}
            <a href={data.buttonHref} className="btn-primary" style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
              {data.buttonText} <span className="btn-arrow">→</span>
            </a>
          </div>
          
          <div className="about-image-wrapper fade-in-section">
            <img src={data.image} alt="Art of Fragrance" className="about-image" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
