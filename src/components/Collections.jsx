import React from 'react';
import { Link } from 'react-router-dom';
import './Collections.css';

const Collections = ({ data }) => {
  return (
    <section className="collections" id="collections">
      <div className="container">
        <div className="section-header fade-in-section">
          <h2 className="heading-2 section-title">{data.title}</h2>
          <div className="title-underline"></div>
          <p className="subtitle">{data.subtitle}</p>
        </div>

        <div className="collections-grid fade-in-section">
          {data.items.map((item, index) => (
            <Link to={`/collections/${item.id}`} key={item.id} className={`collection-card ${index === 2 || index === 3 ? 'full-width' : ''}`}>
              <img src={item.image} alt={item.title} className="collection-image" loading="lazy" />
              <div className="collection-overlay">
                <h3 className="collection-title">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
