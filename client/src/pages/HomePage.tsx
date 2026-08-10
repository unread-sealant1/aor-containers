import React from 'react';
import Hero from '../sections/home/Hero';
import TrustIndicators from '../sections/home/TrustIndicators';
import FeaturedContainers from '../sections/home/FeaturedContainers';
import WhyChooseAOR from '../sections/home/WhyChooseAOR';
import Industries from '../sections/home/Industries';
import HowItWorks from '../sections/home/HowItWorks';
import DeliverySection from '../sections/home/DeliverySection';
import FinalCTA from '../sections/home/FinalCTA';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <TrustIndicators />
      <FeaturedContainers />
      <WhyChooseAOR />
      <Industries />
      <HowItWorks />
      <DeliverySection />
      <FinalCTA />
    </main>
  );
};

export default Home;
