import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import apiClient from '../api/client';
import './ProductList.css';

interface ConditionPrice {
  condition: string;
  sellingPriceZAR: number;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  conditions: ConditionPrice[];
  specifications: {
    location?: string;
    yearOfManufacture?: string;
    [key: string]: any;
  };
  stockQuantity: number;
  availability: string;
  published: boolean;
  updatedAt: string;
  images: { url: string; isPrimary: boolean }[];
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    availability: '',
    published: '',
    location: '',
    yom: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (filters.category) params.category = filters.category;
      if (filters.condition) params.condition = filters.condition;
      if (filters.availability) params.availability = filters.availability;
      if (filters.published) params.published = filters.published;
      if (filters.location) params.location = filters.location;
      if (filters.yom) params.yom = filters.yom;

      const response = await apiClient.get('/admin/containers', { params });
      setProducts(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filters]);

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.patch('/admin/containers/publish', { id, published: !currentStatus });
      fetchProducts();
    } catch (err: any) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await apiClient.delete(`/admin/containers/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleReprice = async () => {
    if (!window.confirm('This will recalculate all selling prices based on current owner costs and default markups. Proceed?')) return;
    try {
      setLoading(true);
      await apiClient.post('/admin/containers/reprice');
      alert('All products have been successfully repriced.');
      fetchProducts();
    } catch (err: any) {
      alert(`Repricing failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) return <div className="empty-state">Loading products...</div>;
  if (error) return <div className="empty-state" style={{ color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div className="product-list-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Container Stock</h1>
          <p className="page-subtitle">Manage live inventory and professional pricing</p>
        </div>
        <div className="header-actions">
          <button onClick={handleReprice} className="btn-secondary">
            <RefreshCw size={18} /> Global Reprice
          </button>
          <Link to="/admin/products/new" className="btn-primary">
            <Plus size={18} /> Add Stock Line
          </Link>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search containers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
            <option value="">All Categories</option>
            <option value="Standard Containers">Standard Containers</option>
            <option value="High Cube Containers">High Cube Containers</option>
            <option value="Refrigerated Containers">Refrigerated Containers</option>
            <option value="Open Top Containers">Open Top Containers</option>
            <option value="Flat Rack Containers">Flat Rack Containers</option>
            <option value="Side Opening Containers">Side Opening Containers</option>
            <option value="Storage Containers">Storage Containers</option>
          </select>
          <select value={filters.condition} onChange={e => setFilters({...filters, condition: e.target.value})}>
            <option value="">All Conditions</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="AS IS">AS IS</option>
            <option value="WWT">WWT</option>
            <option value="CWO">CWO</option>
            <option value="IICL">IICL</option>
          </select>
          <select value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})}>
            <option value="">All Locations</option>
            <option value="Durban">Durban</option>
            <option value="Cape Town">Cape Town</option>
            <option value="Johannesburg">Johannesburg</option>
            <option value="Port Elizabeth">Port Elizabeth</option>
          </select>
          <select value={filters.availability} onChange={e => setFilters({...filters, availability: e.target.value})}>
            <option value="">All Availability</option>
            <option value="Available">Available</option>
            <option value="Limited Availability">Limited Availability</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="On Request">On Request</option>
          </select>
          <select value={filters.published} onChange={e => setFilters({...filters, published: e.target.value})}>
            <option value="">All Status</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
        </div>
      </div>

      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Container Details</th>
              <th>Location & YOM</th>
              <th>Category</th>
              <th>Selling Price</th>
              <th>Stock</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const primaryCondition = product.conditions?.[0];
              return (
                <tr key={product._id}>
                  <td>
                    <img src={product.images?.[0]?.url || 'https://via.placeholder.com/50'} alt={product.name} className="product-thumb" />
                  </td>
                  <td>
                    <div className="product-info">
                      <strong className="product-name">{product.name}</strong>
                      <span className="product-condition">{primaryCondition?.condition || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="location-info">
                      <span className="location-text">{product.specifications?.location || 'Unknown'}</span>
                      <span className="yom-text">{product.specifications?.yearOfManufacture ? `YOM: ${product.specifications.yearOfManufacture}` : 'N/A'}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td className="price-cell">
                    <strong className="selling-price">
                      {primaryCondition?.sellingPriceZAR
                        ? `R${primaryCondition.sellingPriceZAR.toLocaleString()}`
                        : 'On Request'}
                    </strong>
                  </td>
                  <td>{product.stockQuantity}</td>
                  <td>
                    <span className={`status-badge ${
                      product.availability === 'Available' ? 'status-available' :
                      product.availability === 'Limited Availability' ? 'status-limited' : 'status-out'
                    }`}>
                      {product.availability}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => togglePublish(product._id, product.published)}
                      className={`status-btn ${product.published ? 'published' : 'unpublished'}`}
                    >
                      {product.published ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {product.published ? 'Published' : 'Unpublished'}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <Link to={`/admin/products/${product._id}/edit`} title="Edit" className="action-link edit"><Edit size={16} /></Link>
                      <button onClick={() => handleDelete(product._id, product.name)} title="Delete" className="action-link delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && !loading && (
          <div className="empty-state">No containers found matching your filters.</div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
