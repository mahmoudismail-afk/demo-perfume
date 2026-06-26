import React, { useState, useEffect } from 'react';
import { Edit, Trash2, AlertTriangle, Plus } from 'lucide-react';
import './InventoryManager.css';

const InventoryManager = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch from /api/inventory here.
    // For now, we mock the data format matching our D1 schema.
    const mockVariants = [
      { id: '1', sku: 'LUM-50', name: 'Lumière d\'Or', size: '50ml', price_cents: 12500, stock_level: 45, low_stock_threshold: 10, scentFamily: 'Amber' },
      { id: '2', sku: 'LUM-100', name: 'Lumière d\'Or', size: '100ml', price_cents: 18500, stock_level: 12, low_stock_threshold: 15, scentFamily: 'Amber' },
      { id: '3', sku: 'NUIT-50', name: 'Nuit d\'Étoiles', size: '50ml', price_cents: 14000, stock_level: 5, low_stock_threshold: 10, scentFamily: 'Floral' },
      { id: '4', sku: 'NUIT-100', name: 'Nuit d\'Étoiles', size: '100ml', price_cents: 21000, stock_level: 0, low_stock_threshold: 10, scentFamily: 'Floral' },
      { id: '5', sku: 'SOU-50', name: 'Souffle de Printemps', size: '50ml', price_cents: 11000, stock_level: 60, low_stock_threshold: 20, scentFamily: 'Fresh' },
    ];
    
    setTimeout(() => {
      setVariants(mockVariants);
      setLoading(false);
    }, 500);
  }, []);

  const getStockBadge = (stock, threshold) => {
    if (stock === 0) return <span className="stock-badge out-of-stock">Out of Stock</span>;
    if (stock <= threshold) return <span className="stock-badge low-stock">Low Stock</span>;
    return <span className="stock-badge in-stock">In Stock</span>;
  };

  const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

  const totalProducts = variants.length;
  const lowStockCount = variants.filter(v => v.stock_level > 0 && v.stock_level <= v.low_stock_threshold).length;
  const outOfStockCount = variants.filter(v => v.stock_level === 0).length;

  const [editingVariant, setEditingVariant] = useState(null);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVariant, setNewVariant] = useState({ sku: '', name: '', size: '', price_cents: 0, stock_level: 0, low_stock_threshold: 10, scentFamily: '' });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      setVariants(variants.filter(v => v.id !== id));
    }
  };

  const handleEdit = (variant) => {
    setEditingVariant({ ...variant });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setVariants(variants.map(v => v.id === editingVariant.id ? editingVariant : v));
    setEditingVariant(null);
  };

  const saveNewVariant = (e) => {
    e.preventDefault();
    const generatedId = Date.now().toString();
    setVariants([...variants, { ...newVariant, id: generatedId }]);
    setIsAddingVariant(false);
    setNewVariant({ sku: '', name: '', size: '', price_cents: 0, stock_level: 0, low_stock_threshold: 10, scentFamily: '' });
  };

  const scentFamilies = ['Woody', 'Floral', 'Citrus', 'Amber', 'Fresh', 'Spicy'];

  return (
    <div className="inventory-manager">
      <div className="inventory-header">
        <h1>Inventory & Variants</h1>
        <div className="inventory-actions">
          <button className="btn-primary" onClick={() => setIsAddingVariant(true)}>
            <Plus size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Add Variant
          </button>
        </div>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <h3>Total Variants</h3>
          <p className="stat-value">{totalProducts}</p>
        </div>
        <div className="stat-card alert">
          <h3>Low Stock Alerts</h3>
          <p className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={24} /> {lowStockCount}
          </p>
        </div>
        <div className="stat-card">
          <h3>Out of Stock</h3>
          <p className="stat-value">{outOfStockCount}</p>
        </div>
      </div>

      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Size</th>
              <th>Scent</th>
              <th>Price</th>
              <th>Stock Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading inventory...</td></tr>
            ) : variants.map(variant => (
              <tr key={variant.id}>
                <td style={{ fontWeight: 500 }}>{variant.sku}</td>
                <td>{variant.name}</td>
                <td>{variant.size}</td>
                <td>
                  {variant.scentFamily ? (
                    <span style={{ padding: '4px 8px', background: '#f1f5f9', borderRadius: '12px', fontSize: '0.8rem', color: '#475569' }}>
                      {variant.scentFamily}
                    </span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>N/A</span>
                  )}
                </td>
                <td>{formatPrice(variant.price_cents)}</td>
                <td>
                  <strong>{variant.stock_level}</strong> 
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', marginLeft: '4px' }}>
                    / {variant.low_stock_threshold} min
                  </span>
                </td>
                <td>{getStockBadge(variant.stock_level, variant.low_stock_threshold)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="action-btn" title="Edit" onClick={() => handleEdit(variant)}>
                      <Edit size={16} />
                    </button>
                    <button className="action-btn" title="Delete" onClick={() => handleDelete(variant.id)}>
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingVariant && (
        <div className="modal-overlay" onClick={() => setEditingVariant(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '400px' }}>
            <h2 style={{ marginTop: 0 }}>Edit Variant</h2>
            <form onSubmit={saveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Price (Cents)</label>
                <input 
                  type="number" 
                  value={editingVariant.price_cents} 
                  onChange={e => setEditingVariant({...editingVariant, price_cents: parseInt(e.target.value) || 0})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Stock Level</label>
                <input 
                  type="number" 
                  value={editingVariant.stock_level} 
                  onChange={e => setEditingVariant({...editingVariant, stock_level: parseInt(e.target.value) || 0})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Low Stock Threshold</label>
                <input 
                  type="number" 
                  value={editingVariant.low_stock_threshold} 
                  onChange={e => setEditingVariant({...editingVariant, low_stock_threshold: parseInt(e.target.value) || 0})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Scent Family</label>
                <select 
                  value={editingVariant.scentFamily || ''}
                  onChange={e => setEditingVariant({...editingVariant, scentFamily: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white' }}
                >
                  <option value="">None</option>
                  {scentFamilies.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setEditingVariant(null)} style={{ flex: 1, padding: '0.5rem', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddingVariant && (
        <div className="modal-overlay" onClick={() => setIsAddingVariant(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '400px' }}>
            <h2 style={{ marginTop: 0 }}>Add New Variant</h2>
            <form onSubmit={saveNewVariant} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>SKU</label>
                <input 
                  type="text" 
                  value={newVariant.sku} 
                  required
                  onChange={e => setNewVariant({...newVariant, sku: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Name</label>
                <input 
                  type="text" 
                  value={newVariant.name} 
                  required
                  onChange={e => setNewVariant({...newVariant, name: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Size</label>
                <input 
                  type="text" 
                  value={newVariant.size} 
                  required
                  onChange={e => setNewVariant({...newVariant, size: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Price (Cents)</label>
                <input 
                  type="number" 
                  value={newVariant.price_cents} 
                  onChange={e => setNewVariant({...newVariant, price_cents: parseInt(e.target.value) || 0})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Stock</label>
                  <input 
                    type="number" 
                    value={newVariant.stock_level} 
                    onChange={e => setNewVariant({...newVariant, stock_level: parseInt(e.target.value) || 0})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Low Stock</label>
                  <input 
                    type="number" 
                    value={newVariant.low_stock_threshold} 
                    onChange={e => setNewVariant({...newVariant, low_stock_threshold: parseInt(e.target.value) || 0})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Scent Family</label>
                <select 
                  value={newVariant.scentFamily || ''}
                  onChange={e => setNewVariant({...newVariant, scentFamily: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white' }}
                >
                  <option value="">None</option>
                  {scentFamilies.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsAddingVariant(false)} style={{ flex: 1, padding: '0.5rem', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Variant</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
