import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [rating, setRating] = useState(5.0);
  const [badge, setBadge] = useState('');
  const [collectionId, setCollectionId] = useState('for-him');

  const resetForm = () => {
    setName('');
    setPrice('');
    setImage('');
    setRating(5.0);
    setBadge('');
    setCollectionId('for-him');
    setCurrentProduct(null);
    setIsEditing(false);
  };

  const openAddForm = () => {
    resetForm();
    setIsEditing(true);
  };

  const openEditForm = (product) => {
    setCurrentProduct(product);
    setName(product.name);
    setPrice(product.price);
    setImage(product.image);
    setRating(product.rating || 5.0);
    setBadge(product.badge || '');
    setCollectionId(product.collectionId || 'for-him');
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      name,
      price,
      image,
      rating: parseFloat(rating),
      badge,
      collectionId
    };

    if (currentProduct) {
      updateProduct({ ...currentProduct, ...productData });
    } else {
      addProduct(productData);
    }
    resetForm();
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-left">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} /> Back to Store
          </Link>
          <h1>Admin Dashboard</h1>
        </div>
        {!isEditing && (
          <button className="btn-primary" onClick={openAddForm}>
            <Plus size={20} /> Add Product
          </button>
        )}
      </header>

      {isEditing ? (
        <div className="admin-form-container">
          <h2>{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label>Price (e.g. $250)</label>
              <input type="text" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label>Image URL (e.g. /images/product.png)</label>
              <input type="text" value={image} onChange={e => setImage(e.target.value)} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rating (1-5)</label>
                <input type="number" step="0.1" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} />
              </div>
              
              <div className="form-group">
                <label>Badge (Optional)</label>
                <input type="text" value={badge} onChange={e => setBadge(e.target.value)} placeholder="e.g. Bestseller" />
              </div>

              <div className="form-group">
                <label>Collection</label>
                <select value={collectionId} onChange={e => setCollectionId(e.target.value)} style={{ padding: '0.75rem 1rem', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'var(--font-sans)', fontSize: '1rem' }}>
                  <option value="for-him">For HIM</option>
                  <option value="for-her">For Her</option>
                  <option value="bundles">OUR BUNDLES</option>
                  <option value="outlet">OUTLET COLLECTION</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
              <button type="submit" className="btn-primary">Save Product</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Collection</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.name} className="admin-table-image" />
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                    {product.badge && <span className="admin-table-badge">{product.badge}</span>}
                  </td>
                  <td><span style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>{product.collectionId || 'Uncategorized'}</span></td>
                  <td>{product.price}</td>
                  <td>{product.rating?.toFixed(1) || '5.0'}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="btn-icon edit" onClick={() => openEditForm(product)} aria-label="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="btn-icon delete" onClick={() => deleteProduct(product.id)} aria-label="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-table">No products found. Add one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
