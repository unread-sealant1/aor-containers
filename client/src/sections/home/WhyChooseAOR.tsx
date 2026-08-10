import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Clock, DollarSign } from 'lucide-react';
import './WhyChooseAOR.css';

const WhyChooseAOR: React.FC = () => {
  const features = [
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      desc: 'We leverage our network to provide the most cost-effective container solutions in the region.'
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      desc: 'Our logistics network ensures your container arrives safely, whether you are in Gauteng or the Cape.'
    },
    {
      icon: ShieldCheck,
      title: 'Quality Inspected',
      desc: 'Every unit is rigorously checked for structural integrity and wind/water tightness.'
    },
    {
      icon: Clock,
      title: 'Fast Turnaround',
      desc: 'From initial quote to final delivery, we prioritize speed without compromising on quality.'
    },
  ];

  return (
    <section className='why-section'>
      <div className='container'>
        <div className='why-header'>
          <h2 className='why-title'>Why Choose AOR Containers?</h2>
          <p className='why-desc'>
            We combine industry expertise with a commitment to quality, making us the preferred partner for shipping containers in South Africa.
          </p>
        </div>

        <div className='why-grid'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className='why-card'
            >
              <div className='why-icon-box'>
                <feature.icon size={24} />
              </div>
              <h4 className='why-title-text'>{feature.title}</h4>
              <p className='why-desc-text'>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseAOR;
