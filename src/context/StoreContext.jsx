import React, { createContext, useState, useContext, useEffect } from 'react';
import contentData from '../data/content.json';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  
  // Product Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load products from Cloudflare API
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(contentData.bestSellers.products);
        }
      })
      .catch(err => {
        console.error('Failed to load products from API, falling back to local data', err);
        setProducts(contentData.bestSellers.products);
      });

    const savedCart = localStorage.getItem('cartItems');
    const savedWishlist = localStorage.getItem('wishlistItems');
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
  }, []);

  // Save cart & wishlist to local storage on change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Admin Product Functions
  const addProduct = async (product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => [...prev, { ...product, id: data.id }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setCartItems(prev => prev.map(item => item.id === updatedProduct.id ? { ...updatedProduct, quantity: item.quantity } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        removeFromCart(id);
        setWishlistItems(prev => prev.filter(wishId => wishId !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Product Modal Functions
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
  };

  // Cart Functions
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Open drawer when adding
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const toggleWishlist = (productId) => {
    setWishlistItems(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const parsePrice = (priceString) => {
    // Extracts number from strings like "$250"
    const match = priceString.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (parsePrice(item.price) * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    isAuthOpen,
    setIsAuthOpen,
    wishlistItems,
    toggleWishlist,
    selectedProduct,
    isModalOpen,
    openProductModal,
    closeProductModal
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
