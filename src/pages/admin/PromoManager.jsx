import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';
import './PromoManager.css';

const PromoManager = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState('');
  const [maxUses, setMaxUses] = useState('');

  useEffect(() => {
    // Mocking the D1 fetch logic until API integration
    const mockPromos = [
      { id: '1', code: 'WELCOME10', type: 'percentage', value_cents: 1000, max_uses: 100, current_uses: 45, is_active: 1 },
      { id: '2', code: 'FREESHIP', type: 'free_shipping', value_cents: 0, max_uses: null, current_uses: 120, is_active: 1 },
      { id: '3', code: 'HOLIDAY25', type: 'fixed', value_cents: 2500, max_uses: 50, current_uses: 50, is_active: 0 },
    ];
    setTimeout(() => {
      setPromos(mockPromos);
      setLoading(false);
    }, 500);
  }, []);

  const handleCreatePromo = (e) => {
    e.preventDefault();
    const newPromo = {
      id: Date.now().toString(),
      code: code.toUpperCase(),
      type,
      value_cents: parseFloat(value) * (type === 'percentage' ? 100 : 100), // Simplify for mock
      max_uses: maxUses ? parseInt(maxUses) : null,
      current_uses: 0,
      is_active: 1
    };
    setPromos([newPromo, ...promos]);
    setCode(''); setValue(''); setMaxUses('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      setPromos(promos.filter(p => p.id !== id));
    }
  };

  const formatValue = (type, val) => {
    if (type === 'percentage') return `${val / 100}%`;
    if (type === 'fixed') return `$${(val / 100).toFixed(2)}`;
    return 'N/A';
  };

  return (
    <div className="promo-manager">
      <div className="promo-header">
        <h1>Promotions Manager</h1>
      </div>

      <div className="promo-grid">
        <div className="promo-form-container">
          <h2>Create New Promo</h2>
          <form onSubmit={handleCreatePromo}>
            <div className="form-group">
              <label>Promo Code</label>
              <input type="text" required value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. SUMMER20" />
            </div>
            <div className="form-group">
              <label>Discount Type</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="percentage">Percentage Off</option>
                <option value="fixed">Fixed Amount Off</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
            {type !== 'free_shipping' && (
              <div className="form-group">
                <label>Discount Value</label>
                <input type="number" required value={value} onChange={e => setValue(e.target.value)} placeholder={type === 'percentage' ? '10' : '25.00'} />
              </div>
            )}
            <div className="form-group">
              <label>Max Uses (Optional)</label>
              <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="Leave blank for unlimited" />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <Plus size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> Generate Code
            </button>
          </form>
        </div>

        <div className="promo-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="6" style={{textAlign:'center'}}>Loading...</td></tr> : promos.map(promo => (
                <tr key={promo.id}>
                  <td><strong>{promo.code}</strong></td>
                  <td style={{ textTransform: 'capitalize' }}>{promo.type.replace('_', ' ')}</td>
                  <td>{formatValue(promo.type, promo.value_cents)}</td>
                  <td>{promo.current_uses} {promo.max_uses ? `/ ${promo.max_uses}` : '(Unlimited)'}</td>
                  <td>
                    <span className={`promo-badge ${promo.is_active === 1 && (!promo.max_uses || promo.current_uses < promo.max_uses) ? 'active' : 'inactive'}`}>
                      {promo.is_active === 1 && (!promo.max_uses || promo.current_uses < promo.max_uses) ? 'Active' : 'Exhausted/Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" title="Delete" onClick={() => handleDelete(promo.id)}>
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PromoManager;
