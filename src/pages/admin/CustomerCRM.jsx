import React, { useState, useEffect } from 'react';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import './CustomerCRM.css';

const CustomerCRM = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewingCustomer, setViewingCustomer] = useState(null);

  useEffect(() => {
    // Mocking the customer_lifetime_value view
    const mockCustomers = [
      { customer_id: 'c1', first_name: 'Emma', last_name: 'Watson', email: 'emma@example.com', phone: '+1 555-0100', total_orders: 5, lifetime_value_cents: 85000 },
      { customer_id: 'c2', first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone: '+1 555-0101', total_orders: 2, lifetime_value_cents: 24000 },
      { customer_id: 'c3', first_name: 'Sarah', last_name: 'Miller', email: 'sarah.m@example.com', phone: '+1 555-0102', total_orders: 1, lifetime_value_cents: 12500 },
      { customer_id: 'c4', first_name: 'David', last_name: 'Chen', email: 'david.c@example.com', phone: '+1 555-0103', total_orders: 8, lifetime_value_cents: 145000 },
    ];
    // Sort by LTV descending
    mockCustomers.sort((a, b) => b.lifetime_value_cents - a.lifetime_value_cents);
    
    setTimeout(() => {
      setCustomers(mockCustomers);
      setLoading(false);
    }, 500);
  }, []);

  const formatCurrency = (cents) => `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const filteredCustomers = customers.filter(c => 
    c.email.toLowerCase().includes(search.toLowerCase()) || 
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="crm-manager">
      <div className="crm-header">
        <h1>Customer Relationship Management</h1>
      </div>

      <div className="crm-filters">
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Info</th>
              <th>Total Orders</th>
              <th>Lifetime Value (LTV)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{textAlign:'center'}}>Loading...</td></tr> : filteredCustomers.map(customer => (
              <tr key={customer.customer_id}>
                <td className="customer-name-cell">
                  <div className="customer-avatar">
                    {customer.first_name[0]}{customer.last_name[0]}
                  </div>
                  <div>
                    <strong>{customer.first_name} {customer.last_name}</strong>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
                    <Mail size={14} /> {customer.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: 'var(--color-text-light)', marginTop: '4px' }}>
                    <Phone size={14} /> {customer.phone}
                  </div>
                </td>
                <td>{customer.total_orders} orders</td>
                <td>
                  <span className="ltv-badge">{formatCurrency(customer.lifetime_value_cents)}</span>
                </td>
                <td>
                  <button className="action-btn" title="View Profile" onClick={() => setViewingCustomer(customer)}>
                    <ExternalLink size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && !loading && (
              <tr><td colSpan="5" style={{textAlign:'center'}}>No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {viewingCustomer && (
        <div className="modal-overlay" onClick={() => setViewingCustomer(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '400px', textAlign: 'center' }}>
            <div className="customer-avatar" style={{ width: '64px', height: '64px', margin: '0 auto 1rem auto', fontSize: '1.5rem' }}>
              {viewingCustomer.first_name[0]}{viewingCustomer.last_name[0]}
            </div>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>{viewingCustomer.first_name} {viewingCustomer.last_name}</h2>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--color-text-light)' }}>{viewingCustomer.email} <br/> {viewingCustomer.phone}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
              <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Total Orders</p>
                <strong style={{ fontSize: '1.25rem' }}>{viewingCustomer.total_orders}</strong>
              </div>
              <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Lifetime Value</p>
                <strong style={{ fontSize: '1.25rem', color: '#16a34a' }}>{formatCurrency(viewingCustomer.lifetime_value_cents)}</strong>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setViewingCustomer(null)}>
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCRM;
