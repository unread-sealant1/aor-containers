import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className='hero'>
      <div className='hero__bg'>
        <div className='hero__overlay' />
      </div>

      <div className='hero__content container'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='hero__text-wrapper'
        >
          <h1 className='hero__title'>
            Reliable Shipping Containers <br />
            <span className='hero__title-highlight'>Across South Africa & SADC</span>
          </h1>
          <p className='hero__description'>
            Quality new and used shipping containers supplied locally and internationally.
            Request a personalised quotation today for your business or personal storage needs.
          </p>

          <div className='hero__actions'>
            <Link to='/request-a-quote'>
              <Button variant='primary' size='lg' rightIcon={ArrowRight}>
                Request a Quote
              </Button>
            </Link>
            <Link to='/containers'>
              <Button variant='outline' size='lg' className='btn-white'>
                View Containers
              </Button>
            </Link>
          </div>

          <div className='hero__indicators'>
            {[
              'Quality Inspected',
              'Nationwide Delivery',
              'International Export',
              'Fast Quote Turnaround'
            ].map((item, index) => (
              <div key={index} className='hero__indicator-item'>
                <CheckCircle size={16} className='hero__indicator-icon' />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
