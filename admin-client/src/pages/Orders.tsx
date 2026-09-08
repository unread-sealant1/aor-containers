import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import apiClient from '../api/client';
import './Orders.css';

interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string };
  product: { nameSnapshot: string; condition: string };
  quantity: number;
  pricing: { totalZAR: number };
  status: string;
  createdAt: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await apiClient.get('/admin/orders', { params });
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchTerm]);

  if (loading && orders.length === 0) return <div className='orders-loading'>Loading Orders...</div>;
  if (error) return <div className='orders-error'>{error}</div>;

  return (
    <div className='orders-page'>
      <div className='orders-header'>
        <div className='header-text'>
          <h1>Order Requests</h1>
          <p>Manage customer order requests and track fulfillment</p>
        </div>
      </div>

      <div className='orders-filters'>
        <div className='search-container'>
          <Search size={18} className='search-icon' />
          <input
            type='text'
            placeholder='Search order # or customer...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='filter-container'>
          <Filter size={18} className='filter-icon' />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value=''>All Statuses</option>
            <option value='Pending'>Pending</option>
            <option value='Confirmed'>Confirmed</option>
            <option value='Processing'>Processing</option>
            <option value='Completed'>Completed</option>
            <option value='Cancelled'>Cancelled</option>
          </select>
        </div>
      </div>

      <div className='orders-table-container'>
        <table className='orders-table'>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Container</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td><strong className='order-number'>{order.orderNumber}</strong></td>
                <td>
                  <div className='customer-info'>
                    <span className='customer-name'>{order.customer.name}</span>
                    <span className='customer-email'>{order.customer.email}</span>
                  </div>
                </td>
                <td>
                  <div className='product-info'>
                    <span className='product-name'>{order.product.nameSnapshot}</span>
                    <span className='product-condition'>{order.product.condition}</span>
                  </div>
                </td>
                <td>{order.quantity}</td>
                <td className='price-cell'>R{order.pricing.totalZAR.toLocaleString()}</td>
                <td>
                  <span className={`status-badge status-badge--${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/admin/orders/${order._id}`} className='btn-view'>
                    <Eye size={16} /> Details
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className='no-orders'>No order requests found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
