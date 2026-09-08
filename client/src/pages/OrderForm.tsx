import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { formatCurrency } from '../utils/currency';
import './OrderForm.css';

const OrderForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const slug = queryParams.get('slug');
  const condition = queryParams.get('condition');
  const price = parseFloat(queryParams.get('price') || '0');

  const [product, setProduct] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 1,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setLoadingProduct(false);
        return;
      }
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/products/${slug}`);
        const result = await response.json();
        if (result.success) {
          setProduct(result.data);
        }
      } catch (err) {
        console.error('Error fetching product for order form:', err);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (!slug || (!loadingProduct && !product)) {
    return (
      <div className='order-form-container'>
        <div className='order-form-error'>
          <h2>Product Not Found</h2>
          <p>We couldn't find the container you're trying to order. Please go back and select it again.</p>
          <Button onClick={() => navigate('/containers')}>Back to Containers</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          productDetails: {
            productId: product._id,
            condition: condition || product.conditions?.[0]?.condition,
          },
          quantity: formData.quantity,
          customerNotes: formData.notes,
        }),
      });

      const result = await response.json();

      if (result.success) {
        navigate('/order-confirmation', { state: { order: result.data, product } });
      } else {
        setError(result.message || 'Failed to submit order request. Please try again.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const estimatedTotal = price * formData.quantity;

  if (loadingProduct) return <div className='order-form-container text-center'>Loading order details...</div>;

  return (
    <div className='order-form-page'>
      <div className='order-form-container'>
        <div className='order-form-header'>
          <h1>Place Order Request</h1>
          <p>Complete the form below to request a container. AOR Containers will contact you to confirm availability and final arrangements.</p>
        </div>

        <div className='order-summary-card'>
          <div className='summary-header'>
            <h3>Order Summary</h3>
          </div>
          <div className='summary-grid'>
            <div className='summary-item'>
              <span className='summary-label'>Product</span>
              <strong className='summary-value'>{product.name}</strong>
            </div>
            <div className='summary-item'>
              <span className='summary-label'>Condition</span>
              <strong className='summary-value'>{condition || 'N/A'}</strong>
            </div>
            <div className='summary-item'>
              <span className='summary-label'>Location</span>
              <strong className='summary-value'>{product.specifications?.location || 'TBD'}</strong>
            </div>
            <div className='summary-item'>
              <span className='summary-label'>Unit Price</span>
              <strong className='summary-value'>{formatCurrency(price)}</strong>
            </div>
          </div>
          <div className='summary-total'>
            <span className='total-label'>Estimated Total</span>
            <span className='total-value'>{formatCurrency(estimatedTotal)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='order-form'>
          <div className='form-section'>
            <h3 className='section-title'>Contact Information</h3>
            <div className='form-grid'>
              <Input
                label='Full Name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder='John Doe'
              />
              <Input
                label='Email Address'
                type='email'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder='john@example.com'
              />
              <Input
                label='Phone Number'
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder='+27 ...'
              />
            </div>
          </div>

          <div className='form-section'>
            <h3 className='section-title'>Order Details</h3>
            <div className='form-grid'>
              <Input
                label='Quantity'
                type='number'
                value={formData.quantity.toString()}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt((e as any).target.value) || 1 })}
                required
                min={1}
              />
            </div>
            <div className='form-field'>
              <label>Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder='Any special requirements or delivery instructions...'
              />
            </div>
          </div>

          {error && <div className='order-form-error-msg'>{error}</div>}

          <div className='order-form-actions'>
            <Button variant='secondary' onClick={() => navigate(-1)}>Cancel</Button>
            <Button type='submit' variant='primary' disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Order Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;