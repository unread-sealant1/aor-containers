import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import './FinalCTA.css';

const FinalCTA: React.FC = () => {
  return (
    <section className='cta-section'>
      <div className='container cta-container'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className='cta-card'
        >
          <div className='cta-content'>
            <h2 className='cta-title'>
              Looking for a Shipping Container?
            </h2>
            <p className='cta-description'>
              Tell us what you need and our team will prepare a personalised quotation based on your specific requirements.
            </p>
            <Button variant='primary' size='lg' rightIcon={ArrowRight} className='cta-button'>
              Get a Free Quote
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
