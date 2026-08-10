import React from 'react';
import { ShieldCheck, Truck, Globe, Users, Zap, Headphones } from 'lucide-react';
import './TrustIndicators.css';

const TrustIndicators: React.FC = () => {
  const indicators = [
    { icon: ShieldCheck, title: 'Quality Inspected', desc: 'Every container undergoes a rigorous multi-point inspection.' },
    { icon: Truck, title: 'Nationwide Delivery', desc: 'Efficient transport to any location across South Africa.' },
    { icon: Globe, title: 'International Export', desc: 'Seamless shipping to SADC and global destinations.' },
    { icon: Users, title: 'Bulk Orders', desc: 'Competitive pricing and logistics for large scale requirements.' },
    { icon: Zap, title: 'Fast Turnaround', desc: 'Get your personalized quotation within hours, not days.' },
    { icon: Headphones, title: 'Expert Support', desc: 'Dedicated account managers to guide your selection.' },
  ];

  return (
    <section className='trust-section'>
      <div className='container'>
        <div className='trust-grid'>
          {indicators.map((item, index) => (
            <div key={index} className='trust-card'>
              <div className='trust-icon-box'>
                <item.icon size={24} />
              </div>
              <div className='trust-content'>
                <h4 className='trust-title'>{item.title}</h4>
                <p className='trust-desc'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
