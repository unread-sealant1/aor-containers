import React from 'react';
import { Truck, MapPin, Globe } from 'lucide-react';
import Button from '../../components/common/Button';
import './DeliverySection.css';

const DeliverySection: React.FC = () => {
  return (
    <section className='delivery-section'>
      <div className='delivery-decor' />

      <div className='delivery-container container'>
        <div className='delivery-grid'>
          <div>
            <h2 className='delivery-title'>Seamless Delivery <br />Across the Region</h2>
            <p className='delivery-desc'>
              We understand that logistics are the most critical part of container procurement.
              Our experienced team handles the heavy lifting so you don''t have to.
            </p>

            <div className='delivery-features'>
              {[
                { icon: Truck, title: 'Nationwide Delivery', desc: 'Comprehensive transport network covering all major South African provinces.' },
                { icon: MapPin, title: 'Depot Collection', desc: 'Save on transport costs by collecting your unit directly from our depots.' },
                { icon: Globe, title: 'International Export', desc: 'Professional support for export shipments to SADC and beyond.' },
              ].map((item, index) => (
                <div key={index} className='delivery-feature'>
                  <div className='delivery-icon-box'>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className='delivery-feature-title'>{item.title}</h4>
                    <p className='delivery-feature-desc'>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant='primary' size='lg'>Arrange Logistics</Button>
          </div>

          <div className='delivery-image-container'>
            <div className='delivery-image-box'>
               <img
                 src='/logistics.png'
                 alt='AOR Containers Logistics'
                 className='delivery-image'
               />
            </div>
            <div className='delivery-badge'>
              <p className='delivery-badge-title'>Fast & Reliable</p>
              <p className='delivery-badge-text'>Verified Logistics Network</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliverySection;
