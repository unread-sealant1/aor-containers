import React from 'react';
import { MousePointerClick, FileText, CheckCircle2, Truck } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks: React.FC = () => {
  const steps = [
    { icon: MousePointerClick, title: 'Choose Container', desc: 'Browse our selection and find the right size and condition for your needs.' },
    { icon: FileText, title: 'Request a Quote', desc: 'Fill out our simple form with your requirements and location.' },
    { icon: CheckCircle2, title: 'Confirm Availability', desc: 'Our team confirms the stock and provides a personalized quotation.' },
    { icon: Truck, title: 'Arrange Delivery', desc: 'Once confirmed, we coordinate a delivery or collection time that suits you.' },
  ];

  return (
    <section className='how-section'>
      <div className='container'>
        <div className='how-header'>
          <h2 className='how-title'>How It Works</h2>
          <p className='how-desc'>
            Getting a high-quality shipping container is a simple and transparent process.
          </p>
        </div>

        <div className='how-grid'>
          <div className='how-connector' />

          {steps.map((step, index) => (
            <div key={index} className='how-step'>
              <div className='how-icon-circle'>
                <step.icon size={28} />
              </div>
              <h4 className='how-step-title'>{step.title}</h4>
              <p className='how-step-desc'>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
