import React, { useState, useEffect } from 'react';
import { Trash2, Phone, Mail, Package, Filter, Search } from 'lucide-react';
import apiClient from '../api/client';
import './Enquiries.css';

interface Enquiry {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId?: {
    _id: string;
    name: string;
    category: string;
  };
  message: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
}

const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const response = await apiClient.get('/admin/enquiries', { params });
      if (response.data.success) {
        setEnquiries(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch enquiries');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [filters]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await apiClient.patch(`/admin/enquiries/${id}`, { status });
      if (response.data.success) {
        fetchEnquiries();
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      alert(`Error updating status: ${err.response?.data?.message || err.message}`);
    }
  };

  const deleteEnquiry = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the enquiry from ${name}?`)) return;
    try {
      const response = await apiClient.delete(`/admin/enquiries/${id}`);
      if (response.data.success) {
        fetchEnquiries();
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      alert(`Error deleting enquiry: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading && enquiries.length === 0) return <div className="empty-state">Loading enquiries...</div>;
  if (error) return <div className="empty-state" style={{ color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div className="enquiries-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Customer Enquiries</h1>
          <p className="page-subtitle">Manage and track product leads and customer requests</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search enquiries..."
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <div className="filter-group">
          <div className="filter-item">
            <Filter size={18} className="filter-icon" />
            <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="filter-item">
            <select value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})}>
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="enquiries-table-container">
        <table className="enquiries-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product Interest</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map(enquiry => (
              <tr key={enquiry._id}>
                <td className="customer-cell">
                  <div className="customer-info">
                    <strong className="customer-name">{enquiry.customerName}</strong>
                    <div className="customer-contact">
                      <span><Mail size={12} /> {enquiry.customerEmail}</span>
                      <span><Phone size={12} /> {enquiry.customerPhone}</span>
                    </div>
                  </div>
                </td>
                <td className="product-cell">
                  {enquiry.productId ? (
                    <div className="product-tag">
                      <Package size={14} />
                      {enquiry.productId.name}
                    </div>
                  ) : (
                    <span className="general-enquiry">General Enquiry</span>
                  )}
                </td>
                <td>
                  <span className={`priority-badge priority-${enquiry.priority.toLowerCase()}`}>
                    {enquiry.priority}
                  </span>
                </td>
                <td>
                  <select
                    value={enquiry.status}
                    onChange={e => updateStatus(enquiry._id, e.target.value)}
                    className={`status-select status-select--${enquiry.status.toLowerCase().replace(' ', '')}`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-btns">
                    <button onClick={() => alert(`Message: ${enquiry.message}`)} title="View Message" className="action-link view">
                      <Mail size={16} />
                    </button>
                    <button onClick={() => deleteEnquiry(enquiry._id, enquiry.customerName)} title="Delete" className="action-link delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {enquiries.length === 0 && <div className="empty-state">No enquiries found matching the filters</div>}
      </div>
    </div>
  );
};

export default Enquiries;
