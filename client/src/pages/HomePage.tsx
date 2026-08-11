import React, { useEffect } from 'react';
import Hero from '../sections/home/Hero';
import TrustIndicators from '../sections/home/TrustIndicators';
import FeaturedContainers from '../sections/home/FeaturedContainers';
import WhyChooseAOR from '../sections/home/WhyChooseAOR';
import Industries from '../sections/home/Industries';
import HowItWorks from '../sections/home/HowItWorks';
import DeliverySection from '../sections/home/DeliverySection';
import FinalCTA from '../sections/home/FinalCTA';

const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'AOR Containers | Premium Shipping Containers for Sale';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'AOR Containers provides high-quality shipping containers and logistics solutions across South Africa and the SADC region. Get a quote today!');
    }
  }, []);

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
