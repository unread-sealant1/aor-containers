import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Package, Search } from 'lucide-react';
import apiClient from '../api/client';
import './Customers.css';

interface Customer {
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/customers');
        if (response.data.success) {
          setCustomers(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch customers');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="empty-state">Loading customers...</div>;
  if (error) return <div className="empty-state" style={{ color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div className="customers-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Customer Directory</h1>
          <p className="page-subtitle">Manage and view customer history based on orders</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="customers-grid">
        {filteredCustomers.map((customer, index) => (
          <div key={index} className="customer-card">
            <div className="customer-avatar">
              <User size={24} />
            </div>
            <div className="customer-details">
              <h3 className="customer-name">{customer.name}</h3>
              <div className="customer-contact">
                <span><Mail size={14} /> {customer.email}</span>
                <span><Phone size={14} /> {customer.phone}</span>
              </div>
              <div className="customer-stats">
                <span className="stat-label">Total Orders:</span>
                <span className="stat-value">{customer.totalOrders}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredCustomers.length === 0 && <div className="empty-state">No customers found matching your search.</div>}
      </div>
    </div>
  );
};

export default Customers;
