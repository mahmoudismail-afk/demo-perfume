import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import contentData from '../data/content.json';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CollectionPage.css';

const CollectionPage = () => {
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, wishlistItems, openProductModal } = useStore();

  // Find collection details from content.json
  const collectionInfo = contentData.collections.items.find(c => c.id === id);
  
  // Filter products by collectionId
  const collectionProducts = products.filter(p => p.collectionId === id);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on load
  }, [id]);

  if (!collectionInfo) {
    return (
      <div className="collection-page not-found">
        <Navbar data={contentData.site} />
        <div className="collection-page-content" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
          <h1 className="heading-2">Collection Not Found</h1>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '2rem' }}>Back to Home</Link>
        </div>
        <Footer data={{ site: contentData.site, navigation: contentData.navigation }} />
      </div>
    );
  }

  return (
    <div className="collection-page">
      <Navbar data={contentData.site} />
      
      <div className="collection-hero" style={{ backgroundImage: `url(${collectionInfo.image})` }}>
        <div className="collection-hero-overlay"></div>
        <div className="collection-hero-content">
          <h1 className="heading-1">{collectionInfo.title}</h1>
        </div>
      </div>

      <div className="collection-page-content container">
        <div className="collection-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} /> Back to Store
          </Link>
          <p className="subtitle">{collectionProducts.length} Products</p>
        </div>

        {collectionProducts.length === 0 ? (
          <div className="empty-collection">
            <h3 className="heading-3">No products available in this collection yet.</h3>
          </div>
        ) : (
          <div className="collection-products-grid">
            {collectionProducts.map(product => (
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
                  <img src={product.image} alt={product.name} className="product-image" />
                </div>
                
                <div className="product-info" onClick={() => openProductModal(product)} style={{ cursor: 'pointer' }}>
                  <div className="product-rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-value">({product.rating?.toFixed(1) || '5.0'})</span>
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
        )}
      </div>

      <Footer data={{ site: contentData.site, navigation: contentData.navigation }} />
    </div>
  );
};

export default CollectionPage;
