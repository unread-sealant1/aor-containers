import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import QuoteForm from '../components/forms/QuoteForm';
import './ContactPage.css';

const ContactPage: React.FC = () => {
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
                    <span className='contact-detail-value'>+27 (0) 12 345 6789</span>
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
                    <span className='contact-detail-value'>+27 12 345 6789</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='contact-form-container'>
            <div className='contact-form-header'>
              <h2 className='contact-form-title'>Request a Quote</h2>
              <p className='contact-form-desc'>Fill out the form and our team will get back to you shortly.</p>
            </div>
            <QuoteForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
