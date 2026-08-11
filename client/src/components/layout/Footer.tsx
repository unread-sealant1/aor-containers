import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2 } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className='footer'>
      <div className='footer__container'>
        <div className='footer__grid'>
          <div className='footer__brand'>
            <div className='footer__logo'>
              <div className='footer__logo-icon'>AOR</div>
              <span className='footer__logo-text'>Containers</span>
            </div>
            <p className='footer__about'>
              Premium shipping container solutions for B2B and B2C clients across South Africa and SADC regions. Quality inspected, reliably delivered.
            </p>
          </div>
          </div>

          <div className='footer__section'>
            <h4 className='footer__heading'>Quick Links</h4>
            <ul className='footer__links'>
              <li><Link to='/' className='footer__link'>Home</Link></li>
              <li><Link to='/containers' className='footer__link'>Containers</Link></li>
              <li><Link to='/about' className='footer__link'>About Us</Link></li>
              <li><Link to='/contact' className='footer__link'>Contact</Link></li>
            </ul>
          </div>

          <div className='footer__section'>
            <h4 className='footer__heading'>Container Types</h4>
            <ul className='footer__links'>
              <li><Link to='/containers' className='footer__link'>Standard Containers</Link></li>
              <li><Link to='/containers' className='footer__link'>Refrigerated (Reefers)</Link></li>
              <li><Link to='/containers' className='footer__link'>Specialized Containers</Link></li>
              <li><Link to='/containers' className='footer__link'>Storage Solutions</Link></li>
            </ul>
          </div>

          <div className='footer__section'>
            <h4 className='footer__heading'>Contact Info</h4>
            <ul className='footer__contact-list'>
              <li className='footer__contact-item'>
                <MapPin size={18} className='footer__contact-icon' />
                <span>Johannesburg, Gauteng, South Africa</span>
              </li>
              <li className='footer__contact-item'>
                <Phone size={18} className='footer__contact-icon' />
                <span>083 746 4811 / 069 232 9079</span>
              </li>
              <li className='footer__contact-item'>
                <Mail size={18} className='footer__contact-icon' />
                <span>info@aorcontainers.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className='footer__bottom'>
          <p>© {new Date().getFullYear()} AOR Containers. All rights reserved.</p>
          <div className='footer__legal'>
            <Link to='/privacy-policy' className='footer__legal-link'>Privacy Policy</Link>
            <Link to='/terms' className='footer__legal-link'>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
