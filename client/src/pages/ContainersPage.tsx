import React from 'react';
import ProductCard from '../components/common/ProductCard';
import './ContainersPage.css';

const ContainersPage: React.FC = () => {
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
    {
      name: 'Open Top Container',
      desc: 'Designed for oversized cargo that must be loaded from above.',
      spec: 'Specialized Loading',
      img: 'https://images.unsplash.com/photo-1586528116311-6776d796367d?auto=format&fit=crop&q=80&w=800',
      slug: 'open-top'
    },
    {
      name: 'Flat Rack Container',
      desc: 'Ideal for heavy machinery and exceptionally wide loads.',
      spec: 'Heavy Duty',
      img: 'https://images.unsplash.com/photo-1542332213-9b5a5a76670f?auto=format&fit=crop&q=80&w=800',
      slug: 'flat-rack'
    },
  ];

  return (
    <div className='containers-page'>
      <div className='container'>
        <div className='containers-header'>
          <h1 className='containers-title'>Our Container Range</h1>
          <p className='containers-desc'>
            Explore our wide selection of new and used shipping containers,
            rigorously inspected for quality and ready for immediate delivery.
          </p>
        </div>

        <div className='containers-grid'>
          {containers.map((container, index) => (
            <ProductCard key={index} product={container} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContainersPage;
