import React from 'react';
import { motion } from 'framer-motion';
import { Factory, HardHat, Tractor, Box, Warehouse, Store, Home, Building2 } from 'lucide-react';
import './Industries.css';

const Industries: React.FC = () => {
  const industries = [
    { icon: HardHat, name: 'Construction', desc: 'On-site offices, tool storage, and worker accommodation.' },
    { icon: Tractor, name: 'Agriculture', desc: 'Secure seed, feed, and equipment storage in rural areas.' },
    { icon: Factory, name: 'Mining', desc: 'Heavy-duty storage and modular housing for remote mine sites.' },
    { icon: Box, name: 'Logistics', desc: 'Standardized shipping and transit solutions for global trade.' },
    { icon: Warehouse, name: 'Manufacturing', desc: 'Raw material storage and inventory overflow solutions.' },
    { icon: Store, name: 'Retail', desc: 'Pop-up shops, kiosks, and secure inventory management.' },
    { icon: Home, name: 'Residential', desc: 'Backyard storage, garden sheds, and modular home conversions.' },
    { icon: Building2, name: 'Property Dev', desc: 'Temporary site offices and secure material storage.' },
  ];

  return (
    <section className='industries-section'>
      <div className='container'>
        <div className='industries-header'>
          <h2 className='industries-title'>Industries We Serve</h2>
          <p className='industries-desc'>
            Our containers are versatile solutions utilized across various sectors to enhance efficiency and security.
          </p>
        </div>

        <div className='industries-grid'>
          {industries.map((ind, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className='industry-card'
            >
              <div className='industry-icon-box'>
                <ind.icon size={24} />
              </div>
              <div className='industry-info'>
                <h4 className='industry-name'>{ind.name}</h4>
                <p className='industry-desc'>{ind.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
