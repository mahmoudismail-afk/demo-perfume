import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import { StoreProvider } from './context/StoreContext';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import ProductModal from './components/ProductModal';
import AuthModal from './components/AuthModal';
import StorePage from './pages/StorePage';
import AdminDashboard from './pages/AdminDashboard';
import CollectionPage from './pages/CollectionPage';
import CheckoutPage from './pages/CheckoutPage';

import AdminLayout from './pages/AdminLayout';
import InventoryManager from './pages/admin/InventoryManager';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import OrderPipeline from './pages/admin/OrderPipeline';
import CustomerCRM from './pages/admin/CustomerCRM';
import PromoManager from './pages/admin/PromoManager';

function App() {
  // Setup intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    // We need to re-run this observer query whenever the DOM updates
    // In a real app we'd use a MutationObserver or React refs, but this works for demo
    const setupObserver = () => {
      const elements = document.querySelectorAll('.fade-in-section:not(.is-visible)');
      elements.forEach(el => observer.observe(el));
    };

    setupObserver();
    // Re-run occasionally in case of dynamic renders (like modal open/close)
    const interval = setInterval(setupObserver, 1000);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <StoreProvider>
      <div className="app-container">
        <BrowserRouter>
          <CartDrawer />
          <WishlistDrawer />
          <ProductModal />
          <AuthModal />
          
          <Routes>
            <Route path="/" element={<StorePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AnalyticsDashboard />} />
              <Route path="inventory" element={<InventoryManager />} />
              <Route path="orders" element={<OrderPipeline />} />
              <Route path="customers" element={<CustomerCRM />} />
              <Route path="promotions" element={<PromoManager />} />
            </Route>
            <Route path="/collections/:id" element={<CollectionPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </StoreProvider>
  );
}

export default App;
