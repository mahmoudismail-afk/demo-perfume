import React, { useRef } from 'react';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './BestSellers.css';

const BestSellers = ({ data }) => {
  const { products, addToCart, toggleWishlist, wishlistItems, openProductModal } = useStore();
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 250 : 350;
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };
  return (
    <section className="best-sellers">
      <div className="container">
        <div className="section-header fade-in-section">
          <h2 className="heading-2 section-title">{data.title}</h2>
          <div className="title-underline"></div>
          <p className="subtitle">{data.subtitle}</p>
        </div>

        <div className="carousel-container fade-in-section">
          <button className="carousel-btn prev" onClick={() => scroll('left')} aria-label="Previous">
            <ChevronLeft size={24} />
          </button>
          
          <div className="carousel-track" ref={carouselRef}>
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div 
                  className="product-image-container" 
                  onClick={() => openProductModal(product)}
                  style={{ cursor: 'pointer' }}
                >
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <button 
                    className="btn-wishlist" 
                    aria-label="Add to wishlist"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                  >
                    <Heart size={20} fill={wishlistItems.includes(product.id) ? "var(--color-black)" : "none"} />
                  </button>
                  <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
                </div>
                
                <div className="product-info" onClick={() => openProductModal(product)} style={{ cursor: 'pointer' }}>
                  <div className="product-rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-value">({product.rating.toFixed(1)})</span>
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price-row">
                    <div className="product-price">
                      {product.originalPrice && <span className="price-original">{product.originalPrice}</span>}
                      <span className="price-current">{product.price}</span>
                    </div>
                    <button 
                      className="btn-cart" 
                      aria-label="Add to cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="carousel-btn next" onClick={() => scroll('right')} aria-label="Next">
            <ChevronRight size={24} />
          </button>
          
          <div className="carousel-dots">
            {data.products.map((_, index) => (
              <div key={index} className={`dot ${index === 0 ? 'active' : ''}`}></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
