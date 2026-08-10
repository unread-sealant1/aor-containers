import React from 'react';
import { MessageCircle } from 'lucide-react';
import './WhatsAppButton.css';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '27123456789';
  const message = encodeURIComponent('Hello AOR Containers, I would like to enquire about your shipping containers.');
  
  return (
    <a 
      href={`https://wa.me/${phoneNumber}?text=${message}`} 
      target='_blank' 
      rel='noopener noreferrer'
      className='whatsapp-float'
    >
      <div className='whatsapp-tooltip'>
        Chat with us on WhatsApp
      </div>
      <MessageCircle size={32} />
    </a>
  );
};

export default WhatsAppButton;
