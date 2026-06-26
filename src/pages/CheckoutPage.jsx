import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, CreditCard, Banknote } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMsg("Your cart is empty!");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Structure the order data
      const orderPayload = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
        },
        paymentMethod: paymentMethod,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: cartTotal,
        date: new Date().toISOString()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();
      
      if (response.ok || data.success) {
        setOrderId(data.id || 'ORD-' + Math.floor(Math.random() * 1000000));
        clearCart();
        setSuccess(true);
      } else {
        setErrorMsg(data.error || "There was an error processing your order. Please try again.");
      }
    } catch (err) {
      console.error("Order submission failed:", err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-page success-state">
        <div className="container" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
          <CheckCircle size={64} color="var(--color-accent)" style={{ margin: '0 auto 2rem' }} />
          <h1 className="heading-2">Order Confirmed!</h1>
          <p className="subtitle" style={{ margin: '1rem 0 2rem' }}>Thank you for your purchase.</p>
          <p>Your order number is <strong>{orderId}</strong></p>
          <p>We'll send a confirmation email with order details and tracking info.</p>
          <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '3rem' }}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container checkout-container">
        <div className="checkout-header">
          <button className="back-link" onClick={() => navigate(-1)} type="button">
            <ArrowLeft size={20} /> Back to Shopping
          </button>
          <h1 className="heading-2">Checkout</h1>
        </div>

        {errorMsg && (
          <div className="error-message" style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '4px', marginBottom: '2rem', border: '1px solid #f87171' }}>
            {errorMsg}
          </div>
        )}

        <div className="checkout-grid">
          <div className="checkout-form-section">
            <form id="checkout-form" onSubmit={handlePlaceOrder}>
              
              <div className="form-group-section">
                <h3 className="heading-3">Contact Information</h3>
                <div className="form-row">
                  <div className="form-field">
                    <label>First Name</label>
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="form-field">
                    <label>Last Name</label>
                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="form-field">
                    <label>Phone</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-group-section">
                <h3 className="heading-3">Shipping Address</h3>
                <div className="form-field">
                  <label>Address</label>
                  <input type="text" name="address" required value={formData.address} onChange={handleInputChange} />
                </div>
                <div className="form-field">
                  <label>City</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group-section">
                <h3 className="heading-3">Payment Method</h3>
                <div className="cod-message fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                    <Banknote size={20} /> Cash on Delivery
                  </div>
                  <p>You will pay for your order when it is delivered to your address.</p>
                </div>
              </div>

            </form>
          </div>

          <div className="checkout-summary-section">
            <h3 className="heading-3">Order Summary</h3>
            <div className="summary-items">
              {cartItems.map((item, index) => (
                <div key={item.id + index} className="summary-item">
                  <div className="summary-item-image">
                    <img src={item.image} alt={item.name} />
                    <span className="item-quantity-badge">{item.quantity}</span>
                  </div>
                  <div className="summary-item-details">
                    <h4>{item.name}</h4>
                  </div>
                  <div className="summary-item-price">
                    {item.price}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${cartTotal}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form" 
              className="btn-primary place-order-btn"
              disabled={isSubmitting || cartItems.length === 0}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
