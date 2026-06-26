import React from 'react';
import { X, ShoppingCart, Heart, TreePine, Flower2, Sun, Flame, Wind, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './ProductModal.css';

const ProductModal = () => {
  const { isModalOpen, closeProductModal, selectedProduct, addToCart, toggleWishlist, wishlistItems } = useStore();

  if (!isModalOpen || !selectedProduct) return null;

  const getScentIcon = (family) => {
    switch (family) {
      case 'Woody': return <TreePine size={16} />;
      case 'Floral': return <Flower2 size={16} />;
      case 'Citrus': return <Sun size={16} />;
      case 'Amber': return <Flame size={16} />;
      case 'Fresh': return <Wind size={16} />;
      case 'Spicy': return <Zap size={16} />;
      default: return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={closeProductModal}>
      <div className={`modal-content ${isModalOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={closeProductModal}>
          <X size={24} />
        </button>
        
        <div className="modal-body">
          <div className="modal-image-container">
            {selectedProduct.badge && <span className="product-badge">{selectedProduct.badge}</span>}
            <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-image" loading="lazy" />
          </div>
          
          <div className="modal-info">
            <h2 className="heading-2 modal-title">{selectedProduct.name}</h2>
            
            <div className="modal-rating">
              <span className="stars">★★★★★</span>
              <span className="rating-value">({selectedProduct.rating?.toFixed(1) || '5.0'})</span>
            </div>

            {selectedProduct.scentFamily && (
              <div className="scent-badge">
                {getScentIcon(selectedProduct.scentFamily)}
                <span>{selectedProduct.scentFamily}</span>
              </div>
            )}
            
            <div className="modal-price">
              {selectedProduct.originalPrice && <span className="price-original">{selectedProduct.originalPrice}</span>}
              <span className="price-current">{selectedProduct.price}</span>
            </div>
            
            <div className="modal-description">
              <p>Experience the luxurious scent of {selectedProduct.name}. Carefully crafted with premium ingredients to provide a long-lasting and unforgettable fragrance. Perfect for any occasion.</p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-primary modal-add-cart"
                onClick={() => {
                  addToCart(selectedProduct);
                  closeProductModal();
                }}
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              
              <button 
                className={`modal-wishlist ${wishlistItems.includes(selectedProduct.id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(selectedProduct.id)}
                aria-label="Toggle wishlist"
              >
                <Heart size={24} fill={wishlistItems.includes(selectedProduct.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
