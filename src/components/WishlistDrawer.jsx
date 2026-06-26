import React from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './CartDrawer.css'; // Reusing the same CSS for consistency

const WishlistDrawer = () => {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlistItems,
    toggleWishlist,
    products,
    addToCart
  } = useStore();

  if (!isWishlistOpen) return null;

  // wishlistItems is an array of IDs. We need to map them to actual product objects
  const savedProducts = products.filter(p => wishlistItems.includes(p.id));

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsWishlistOpen(false)}></div>
      <div className={`cart-drawer ${isWishlistOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Wishlist</h2>
          <button className="close-btn" onClick={() => setIsWishlistOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-content">
          {savedProducts.length === 0 ? (
            <div className="empty-cart">
              <p>Your wishlist is empty.</p>
              <button className="btn-primary" onClick={() => setIsWishlistOpen(false)}>
                Explore Products
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {savedProducts.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">{item.price}</p>
                    <div className="cart-item-actions" style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn-primary" 
                        style={{ padding: '0.25rem 0.5rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.8rem' }}
                        onClick={() => {
                          addToCart(item);
                        }}
                      >
                        <ShoppingCart size={14} /> Add
                      </button>
                      <button 
                        className="remove-btn" 
                        onClick={() => toggleWishlist(item.id)}
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistDrawer;
