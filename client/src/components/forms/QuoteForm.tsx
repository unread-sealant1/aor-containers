import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import axios from 'axios';
import './QuoteForm.css';

const QuoteForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: 'South Africa',
    province: '',
    product: '',
    quantity: 1,
    condition: 'Used',
    deliveryAddress: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/quotes/submit', formData);
      setSubmitted(true);
    } catch (error) {
      alert('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='success-container'
      >
        <div className='success-icon'>
          <CheckCircle size={40} />
        </div>
        <h2 className='success-title'>Quote Request Sent!</h2>
        <p className='success-text'>
          Thank you for reaching out. Our team is reviewing your requirements and will get back to you with a personalised quotation shortly.
        </p>
        <Button variant='primary' onClick={() => setSubmitted(false)}>Submit Another Request</Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='quote-form'>
      <div className='form-grid'>
        <Input label='Full Name' name='name' required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <Input label='Company' name='company' required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
        <Input label='Email Address' name='email' type='email' required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        <Input label='Phone Number' name='phone' required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        <Input label='Country' name='country' required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
        <Input label='Province' name='province' required value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} />
        <Input label='Product Required' name='product' required value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} />
        <Input label='Quantity' name='quantity' type='number' required value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
      </div>

      <div className='form-group'>
        <label className='form-label'>Condition</label>
        <select
          className='form-select'
          value={formData.condition}
          onChange={e => setFormData({...formData, condition: e.target.value})}
        >
          <option value='Used'>Used</option>
          <option value='New'>New</option>
        </select>
      </div>

      <Input label='Delivery Address' name='deliveryAddress' required value={formData.deliveryAddress} onChange={e => setFormData({...formData, deliveryAddress: e.target.value})} />

      <div className='form-group'>
        <label className='form-label'>Additional Notes</label>
        <textarea
          className='form-textarea'
          value={formData.notes}
          onChange={e => setFormData({...formData, notes: e.target.value})}
        ></textarea>
      </div>

      <div className='form-submit-container'>
        <Button variant='primary' size='lg' rightIcon={Send} isLoading={isLoading} className='form-submit-btn'>
          Request Quote
        </Button>
      </div>
    </form>
  );
};

export default QuoteForm;
