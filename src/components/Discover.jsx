import React from 'react';
import './Discover.css';

const Discover = ({ data }) => {
  return (
    <section className="discover">
      <div className="container">
        <div className="discover-content fade-in-section">
          <h2 className="heading-2 discover-title">{data.title}</h2>
          <p className="discover-description">{data.description}</p>
          <a href={data.buttonHref} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            {data.buttonText} <span className="btn-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Discover;
