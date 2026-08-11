import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About Us | AOR Containers';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn more about AOR Containers, the leading provider of shipping container solutions in South Africa and the SADC region.');
    }
  }, []);

  return (
    <div className='about-page'>
      <div className='about-hero'>
        <div className='container'>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className='about-hero-title'
          >
            About AOR Containers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='about-hero-desc'
          >
            Setting the standard for container supply and logistics across South Africa and the SADC region.
          </motion.p>
        </div>
      </div>

      <div className='container'>
        <div className='about-content'>
          <div className='about-text'>
            <div className='about-text-block'>
              <h2>Our Commitment to Quality</h2>
              <p>
                AOR Containers was founded on a simple principle: providing the highest quality shipping containers
                with absolute transparency and reliability. We understand that for our clients, a container is not just
                a box—it's a critical asset for their business, storage, or logistics operation.
              </p>
            </div>
            <div className='about-text-block'>
              <h2>Industrial Expertise</h2>
              <p>
                With years of experience in the South African industrial landscape, we've built a network that ensures
                seamless procurement and delivery. Every unit we supply undergoes a rigorous inspection process,
                ensuring it is wind and water-tight, structurally sound, and fit for purpose.
              </p>
            </div>
          </div>
          <div className='about-image-wrapper'>
            <img
              src='/AOR-facilities.png'
              alt='AOR Containers Facility'
              className='about-image'
            />
          </div>
        </div>

        <div className='about-values'>
          <div className='value-card'>
            <h3>Reliability</h3>
            <p>We deliver what we promise, on time, every time. Our logistics network is optimized for speed and safety.</p>
          </div>
          <div className='value-card'>
            <h3>Integrity</h3>
            <p>Honest grading of container conditions. No hidden surprises—just quality units at fair prices.</p>
          </div>
          <div className='value-card'>
            <h3>Professionalism</h3>
            <p>From the first quote to final delivery, we provide a premium B2B experience tailored to your needs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
