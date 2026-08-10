import React from 'react';
import { motion } from 'framer-motion';
import QuoteForm from '../components/forms/QuoteForm';
import './RequestQuotePage.css';

const RequestQuotePage: React.FC = () => {
  return (
    <div className='request-page'>
      <div className='container request-container'>
        <div className='request-header'>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className='request-title'
          >
            Request a Personalised Quotation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='request-desc'
          >
            Fill in the details below and our logistics experts will provide you with the best pricing and delivery options.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='request-form-wrapper'
        >
          <QuoteForm />
        </motion.div>
      </div>
    </div>
  );
};

export default RequestQuotePage;
