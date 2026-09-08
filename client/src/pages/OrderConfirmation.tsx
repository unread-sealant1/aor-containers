import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/currency';
import './OrderConfirmation.css';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order, product } = location.state as { order: any, product: any } || {};

  if (!order) {
    return (
      <div className='confirmation-container'>
        <div className='confirmation-error'>
          <h2>No Order Found</h2>
          <p>We couldn't find your order details. Please contact us if you believe this is an error.</p>
          <Button onClick={() => navigate('/containers')}>Back to Containers</Button>
        </div>
      </div>
    );
  }

  const totalZAR = order.totalZAR;

  const handleWhatsAppOrder = () => {
    const phoneNumber = '27692329079'; // This should ideally come from Settings
    const message = encodeURIComponent(
      `Hi, I would love to buy the ${product?.name} at a selling price of ${formatCurrency(order.unitPriceZAR)} at ${product?.location || 'TBD'}.\n\nOrder Request: ${order.orderNumber}\nQuantity: ${order.quantity}`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className='confirmation-page'>
      <div className='confirmation-container'>
        <div className='confirmation-header'>
          <div className='success-icon'>✓</div>
          <h1>Order Request Received</h1>
          <p>Your order request has been submitted successfully. AOR Containers will contact you shortly to confirm availability and next steps.</p>
        </div>

        <div className='confirmation-card'>
          <div className='order-number-box'>
            <span className='label'>Order Number</span>
            <span className='value'>{order.orderNumber}</span>
          </div>

          <div className='confirmation-details'>
            <div className='detail-row'>
              <span className='detail-label'>Product:</span>
              <span className='detail-value'>{product?.name || 'Container'}</span>
            </div>
            <div className='detail-row'>
              <span className='detail-label'>Condition:</span>
              <span className='detail-value'>{product?.condition || 'N/A'}</span>
            </div>
            <div className='detail-row'>
              <span className='detail-label'>Location:</span>
              <span className='detail-value'>{product?.location || 'TBD'}</span>
            </div>
            <div className='detail-row'>
              <span className='detail-label'>Quantity:</span>
              <span className='detail-value'>{order.quantity}</span>
            </div>
            <div className='detail-row'>
              <span className='detail-label'>Unit Price:</span>
              <span className='detail-value'>{formatCurrency(order.unitPriceZAR)}</span>
            </div>
            <div className='detail-row total'>
              <span className='detail-label'>Estimated Total:</span>
              <span className='detail-value'>{formatCurrency(totalZAR)}</span>
            </div>
          </div>
        </div>

        <div className='confirmation-actions'>
          <Button variant='primary' onClick={handleWhatsAppOrder} className='whatsapp-cta'>
            Continue on WhatsApp
          </Button>
          <Button variant='secondary' onClick={() => navigate('/containers')}>
            Continue Browsing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
