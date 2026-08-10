import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import ProductCard from '../../components/common/ProductCard';
import './FeaturedContainers.css';

const FeaturedContainers: React.FC = () => {
  const containers = [
    {
      name: '20ft Standard Container',
      desc: 'The industry standard for general cargo and storage.',
      spec: 'Capacity: 33.2 m³',
      img: 'https://images.unsplash.com/photo-1586528116311-6776d796367d?auto=format&fit=crop&q=80&w=800',
      slug: '20ft-standard'
    },
    {
      name: '40ft Standard Container',
      desc: 'Ideal for large shipments and high-volume storage.',
      spec: 'Capacity: 67.7 m³',
      img: 'https://images.unsplash.com/photo-1542332213-9b5a5a76670f?auto=format&fit=crop&q=80&w=800',
      slug: '40ft-standard'
    },
    {
      name: '40ft High Cube',
      desc: 'Extra height for oversized cargo and maximum space.',
      spec: 'Capacity: 76.4 m³',
      img: 'https://images.unsplash.com/photo-1605117725419-25d57767929e?auto=format&fit=crop&q=80&w=800',
      slug: '40ft-high-cube'
    },
    {
      name: 'Refrigerated Container',
      desc: 'Temperature controlled for perishable and sensitive goods.',
      spec: 'Temp: -30°C to +30°C',
      img: 'https://images.unsplash.com/photo-1590274853876?auto=format&fit=crop&q=80&w=800',
      slug: 'refrigerated'
    },
  ];

  return (
    <section className='featured-section'>
      <div className='container'>
        <div className='featured-header'>
          <h2 className='featured-title'>Featured Containers</h2>
          <p className='featured-desc'>
            Choose from our wide range of inspected containers tailored to your logistics and storage requirements.
          </p>
        </div>

        <div className='featured-grid'>
          {containers.map((container, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className='featured-card-wrapper'
            >
              <ProductCard product={container} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedContainers;
