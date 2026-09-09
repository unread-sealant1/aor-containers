import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import apiClient from '../api/client';
import './OrderDetail.css';

interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string };
  product: { productId: string; nameSnapshot: string; condition: string; location: string };
  quantity: number;
  pricing: { unitPriceZAR: number; totalZAR: number; currency: string };
  status: string;
  notes: { customerNotes?: string; adminNotes?: string };
  createdAt: string;
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/admin/orders/${id}`);
        if (response.data.success) {
          const data = response.data.data;
          setOrder(data);
          setStatus(data.status);
          setAdminNotes(data.notes?.adminNotes || '');
        }
      } catch (error: any) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    setSaving(true);
    try {
      const response = await apiClient.patch(`/admin/orders/${id}/status`, { status });
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error: any) {
      alert(`Error updating status: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleNotesUpdate = async () => {
    setSaving(true);
    try {
      const response = await apiClient.patch(`/admin/orders/${id}/notes`, { adminNotes });
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error: any) {
      alert(`Error updating notes: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className='order-detail-loading'>Loading Order Details...</div>;
  if (!order) return <div className='order-detail-error'>Order Not Found</div>;

  return (
    <div className='order-detail-page'>
      <div className='order-detail-container'>
        <div className='order-detail-header'>
          <button onClick={() => navigate('/admin/orders')} className='btn-back'>
            <ArrowLeft size={18} /> Back to Orders
          </button>
          <div className='order-number-header'>
            <span className='label'>Order Number:</span>
            <span className='value'>{order.orderNumber}</span>
          </div>
        </div>

        <div className='order-detail-grid'>
          <div className='detail-card'>
            <h3 className='card-title'>Customer Information</h3>
            <div className='detail-item'>
              <span className='label'>Name:</span>
              <span className='value'>{order.customer.name}</span>
            </div>
            <div className='detail-item'>
              <span className='label'>Email:</span>
              <span className='value'>{order.customer.email}</span>
            </div>
            <div className='detail-item'>
              <span className='label'>Phone:</span>
              <span className='value'>{order.customer.phone}</span>
            </div>
          </div>

          <div className='detail-card'>
            <h3 className='card-title'>Product Details</h3>
            <div className='detail-item'>
              <span className='label'>Product:</span>
              <span className='value'>{order.product.nameSnapshot}</span>
            </div>
            <div className='detail-item'>
              <span className='label'>Condition:</span>
              <span className='value'>{order.product.condition}</span>
            </div>
            <div className='detail-item'>
              <span className='label'>Location:</span>
              <span className='value'>{order.product.location}</span>
            </div>
            <div className='detail-item'>
              <span className='label'>Quantity:</span>
              <span className='value'>{order.quantity}</span>
            </div>
          </div>

          <div className='detail-card'>
            <h3 className='card-title'>Pricing Snapshot</h3>
            <div className='detail-item'>
              <span className='label'>Unit Price:</span>
              <span className='value'>R{order.pricing.unitPriceZAR.toLocaleString()}</span>
            </div>
            <div className='detail-item total'>
              <span className='label'>Total Amount:</span>
              <span className='value'>R{order.pricing.totalZAR.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className='order-management-section'>
          <div className='management-card'>
            <h3 className='card-title'>Status Management</h3>
            <div className='status-controls'>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className='status-select'>
                <option value='Pending'>Pending</option>
                <option value='Confirmed'>Confirmed</option>
                <option value='Processing'>Processing</option>
                <option value='Completed'>Completed</option>
                <option value='Cancelled'>Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className='btn-primary'
                disabled={saving || status === order.status}
              >
                {saving ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          <div className='management-card'>
            <h3 className='card-title'>Internal Admin Notes</h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder='Enter internal notes regarding this order...'
              className='admin-notes-textarea'
            />
            <div className='notes-actions'>
              <button
                onClick={handleNotesUpdate}
                className='btn-primary'
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Notes'}
                <Save size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
