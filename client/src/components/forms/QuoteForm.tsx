import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import axios from 'axios';
import './QuoteForm.css';

const countries = [
  "South Africa", "Botswana", "Namibia", "Zimbabwe", "Mozambique", "Lesotho", "Eswatini", "Angola", "Zambia", "Malawi",
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "India", "China", "Brazil", "Other"
];

const QuoteForm: React.FC<{ productSlug?: string }> = ({ productSlug }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '+27',
    country: 'South Africa',
    otherCountry: '',
    province: '',
    product: '',
    quantity: 1,
    condition: 'Used',
    deliveryMethod: 'Collection',
    deliveryAddress: '',
    notes: '',
  });

  useEffect(() => {
    if (productSlug) {
      const productMap: Record<string, string> = {
        '20ft-standard': '20ft Standard Container',
        '40ft-standard': '40ft Standard Container',
        '40ft-high-cube': '40ft High Cube',
        'refrigerated': 'Refrigerated Container',
        'open-top': 'Open Top Container',
        'flat-rack': 'Flat Rack Container',
      };
      setFormData(prev => ({ ...prev, product: productMap[productSlug] || productSlug }));
    }
  }, [productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // If 'Other' is selected, use the specified country instead
      const submissionData = {
        ...formData,
        country: formData.country === 'Other' ? formData.otherCountry : formData.country
      };

      await axios.post(`${API_URL}/api/quotes/submit`, submissionData);
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

        <div className='form-group'>
          <label className='form-label'>Country</label>
          <select
            className='form-select'
            required
            value={formData.country}
            onChange={e => setFormData({...formData, country: e.target.value})}
          >
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {formData.country === 'Other' && (
          <Input
            label='Please specify country'
            name='otherCountry'
            required
            value={formData.otherCountry}
            onChange={e => setFormData({...formData, otherCountry: e.target.value})}
          />
        )}

        <Input label='Province/State' name='province' required value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} />

        <div className='form-group'>
          <label className='form-label'>Product Required</label>
          <select
            className='form-select'
            required
            value={formData.product}
            onChange={e => setFormData({...formData, product: e.target.value})}
          >
            <option value=''>Select a Container</option>
            <option value='20ft Standard Container'>20ft Standard Container</option>
            <option value='40ft Standard Container'>40ft Standard Container</option>
            <option value='40ft High Cube'>40ft High Cube</option>
            <option value='Refrigerated Container'>Refrigerated Container</option>
            <option value='Open Top Container'>Open Top Container</option>
            <option value='Flat Rack Container'>Flat Rack Container</option>
          </select>
        </div>
        <Input label='Quantity' name='quantity' type='number' required value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
      </div>

      <div className='form-grid-half'>
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

        <div className='form-group'>
          <label className='form-label'>Delivery Method</label>
          <select
            className='form-select'
            value={formData.deliveryMethod}
            onChange={e => setFormData({...formData, deliveryMethod: e.target.value})}
          >
            <option value='Collection'>Collection</option>
            <option value='Delivery'>Delivery (Upon Request Only)</option>
          </select>
        </div>
      </div>

      <Input
        label={formData.deliveryMethod === 'Delivery' ? 'Delivery Address' : 'Collection Location / City'}
        name='deliveryAddress'
        required={formData.deliveryMethod === 'Delivery'}
        value={formData.deliveryAddress}
        onChange={e => setFormData({...formData, deliveryAddress: e.target.value})}
      />

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
