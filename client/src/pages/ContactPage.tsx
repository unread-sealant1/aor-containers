import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        setFormData({ customerName: '', customerEmail: '', customerPhone: '', message: '' });
      } else {
        setError(result.message || 'Failed to send enquiry. Please try again.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='contact-page'>
      <div className='container'>
        <div className='contact-grid'>
          <div className='contact-info'>
            <div className='contact-info-card'>
              <h2 className='contact-info-title'>Get in Touch</h2>
              <p className='contact-info-desc'>
                Contact our sales and logistics team for a personalised quotation or to discuss your requirements.
              </p>
              <div className='contact-details'>
                <div className='contact-detail'>
                  <Phone className='contact-detail-icon' size={24} />
                  <div className='contact-detail-text'>
                    <span className='contact-detail-label'>Phone</span>
                    <span className='contact-detail-value'>+27 69 232 9079</span>
                  </div>
                </div>
                <div className='contact-detail'>
                  <Mail className='contact-detail-icon' size={24} />
                  <div className='contact-detail-text'>
                    <span className='contact-detail-label'>Email</span>
                    <span className='contact-detail-value'>info@aorcontainers.com</span>
                  </div>
                </div>
                <div className='contact-detail'>
                  <MapPin className='contact-detail-icon' size={24} />
                  <div className='contact-detail-text'>
                    <span className='contact-detail-label'>Location</span>
                    <span className='contact-detail-value'>Johannesburg, Gauteng, South Africa</span>
                  </div>
                </div>
                <div className='contact-detail'>
                  <MessageCircle className='contact-detail-icon' size={24} />
                  <div className='contact-detail-text'>
                    <span className='contact-detail-label'>WhatsApp</span>
                    <span className='contact-detail-value'>+27 69 232 9079</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='contact-form-container'>
            <div className='contact-form-header'>
              <h2 className='contact-form-title'>Send an Enquiry</h2>
              <p className='contact-form-desc'>Fill out the form and our team will get back to you shortly.</p>
            </div>

            {submitted ? (
              <div className='contact-success-message'>
                <div className='success-icon'>✓</div>
                <h3>Enquiry Sent!</h3>
                <p>Thank you for contacting us. Our team will get back to you shortly.</p>
                <Button onClick={() => setSubmitted(false)} variant='secondary'>Send another enquiry</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='contact-form'>
                <div className='form-grid'>
                  <Input
                    label='Full Name'
                    value={formData.customerName}
                    onChange={(val) => setFormData({ ...formData, customerName: val })}
                    required
                    placeholder='Your Name'
                  />
                  <Input
                    label='Email Address'
                    type='email'
                    value={formData.customerEmail}
                    onChange={(val) => setFormData({ ...formData, customerEmail: val })}
                    required
                    placeholder='your@email.com'
                  />
                  <Input
                    label='Phone Number'
                    value={formData.customerPhone}
                    onChange={(val) => setFormData({ ...formData, customerPhone: val })}
                    required
                    placeholder='+27 ...'
                  />
                </div>
                <div className='form-field'>
                  <label>Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    placeholder='How can we help you?'
                  />
                </div>
                {error && <div className='contact-form-error'>{error}</div>}
                <Button type='submit' variant='primary' disabled={loading}>
                  {loading ? 'Sending...' : 'Send Enquiry'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
