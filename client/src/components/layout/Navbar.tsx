import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../common/Button';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Containers', path: '/containers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? '' : 'navbar--transparent'}`}>
      <div className='navbar__container container'>
        <div className='navbar__wrapper'>
          <Link to='/' className='navbar__brand'>
            <img src='/Main-logo.png' alt='AOR Containers Logo' className='navbar__logo-img' />
          </Link>

          <div className='navbar__links'>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className='navbar__link'
              >
                {link.name}
              </Link>
            ))}
            <div className='navbar__cta'>
              <Link to='/request-a-quote'>
                <Button variant='primary' size='sm'>Request a Quote</Button>
              </Link>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className='navbar__mobile-toggle'
            aria-label='Toggle Menu'
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className='navbar__mobile-menu'>
          <div className='navbar__mobile-links'>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className='navbar__mobile-link'
              >
                {link.name}
              </Link>
            ))}
            <div className='navbar__mobile-cta'>
              <Link to='/request-a-quote' onClick={() => setIsOpen(false)}>
                <Button variant='primary' className='btn-block'>Request a Quote</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
