import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import RequestQuotePage from './pages/RequestQuotePage';
import ContainersPage from './pages/ContainersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import WhatsAppButton from './components/common/WhatsAppButton';

const App: React.FC = () => {
  return (
    <Router>
      <div className='app-layout'>
        <Navbar />
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/containers' element={<ContainersPage />} />
            <Route path='/containers/:slug' element={<ProductPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/request-a-quote' element={<RequestQuotePage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
};

export default App;
