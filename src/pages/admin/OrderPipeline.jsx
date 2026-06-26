import React, { useState, useEffect } from 'react';
import { Package, ExternalLink, Calendar, Phone } from 'lucide-react';
import './OrderPipeline.css';

const OrderPipeline = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [viewingOrder, setViewingOrder] = useState(null);

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled'];

  useEffect(() => {
    // Mock orders based on D1 Schema
    const mockOrders = [
      { id: 'ORD-1001', customer_name: 'Emma Watson', customer_phone: '+1 555-0100', total_amount_cents: 12500, discount_amount_cents: 0, status: 'Pending', created_at: '2023-10-08T10:30:00Z', items_count: 1 },
      { id: 'ORD-1002', customer_name: 'John Doe', customer_phone: '+1 555-0101', total_amount_cents: 25000, discount_amount_cents: 2500, status: 'Processing', created_at: '2023-10-08T09:15:00Z', items_count: 2 },
      { id: 'ORD-1003', customer_name: 'Sarah Miller', customer_phone: '+1 555-0102', total_amount_cents: 14000, discount_amount_cents: 0, status: 'Shipped', created_at: '2023-10-07T14:20:00Z', items_count: 1 },
      { id: 'ORD-1004', customer_name: 'David Chen', customer_phone: '+1 555-0103', total_amount_cents: 42000, discount_amount_cents: 0, status: 'Delivered', created_at: '2023-10-05T11:00:00Z', items_count: 3 },
      { id: 'ORD-1005', customer_name: 'Alice Smith', customer_phone: '+1 555-0104', total_amount_cents: 11000, discount_amount_cents: 1000, status: 'Canceled', created_at: '2023-10-08T08:00:00Z', items_count: 1 },
    ];
    
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const formatCurrency = (cents) => `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  const formatDate = (isoString) => new Date(isoString).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    // Here we would call the /api/orders/[id]/status API
  };

  const filteredOrders = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab);

  return (
    <div className="order-pipeline">
      <div className="pipeline-header">
        <h1>Order Pipeline</h1>
      </div>

      <div className="status-tabs">
        {statuses.map(status => (
          <button 
            key={status} 
            className={`status-tab ${activeTab === status ? 'active' : ''}`}
            onClick={() => setActiveTab(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Net Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="7" style={{textAlign:'center'}}>Loading...</td></tr> : filteredOrders.map(order => (
              <tr key={order.id}>
                <td><strong>{order.id}</strong></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
                    <Calendar size={14} /> {formatDate(order.created_at)}
                  </div>
                </td>
                <td>
                  <div>{order.customer_name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '4px' }}>
                    <Phone size={12} /> {order.customer_phone}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Package size={14} /> {order.items_count} item(s)
                  </div>
                </td>
                <td>
                  <strong>{formatCurrency(order.total_amount_cents - order.discount_amount_cents)}</strong>
                  {order.discount_amount_cents > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                      Includes {formatCurrency(order.discount_amount_cents)} off
                    </div>
                  )}
                </td>
                <td>
                  <select 
                    className="status-select" 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {statuses.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button className="action-btn" title="View Details" onClick={() => setViewingOrder(order)}>
                    <ExternalLink size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && !loading && (
              <tr><td colSpan="7" style={{textAlign:'center'}}>No orders found for this status.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {viewingOrder && (
        <div className="modal-overlay" onClick={() => setViewingOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Order {viewingOrder.id}</h2>
              <span className={`order-status-badge ${viewingOrder.status}`}>{viewingOrder.status}</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Customer</p>
                <strong>{viewingOrder.customer_name}</strong><br />
                <span style={{ fontSize: '0.875rem' }}>{viewingOrder.customer_phone}</span>
              </div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Date Placed</p>
                <strong>{formatDate(viewingOrder.created_at)}</strong>
              </div>
            </div>

            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal ({viewingOrder.items_count} items)</span>
                <span>{formatCurrency(viewingOrder.total_amount_cents)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#16a34a' }}>
                <span>Discounts</span>
                <span>-{formatCurrency(viewingOrder.discount_amount_cents)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                <span>Net Total</span>
                <span>{formatCurrency(viewingOrder.total_amount_cents - viewingOrder.discount_amount_cents)}</span>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setViewingOrder(null)}>
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPipeline;
