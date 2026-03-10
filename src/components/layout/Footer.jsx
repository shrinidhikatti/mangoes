import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
          <path d="M0 60V20C240 0 480 40 720 30C960 20 1200 0 1440 20V60H0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="footer-body">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🥭</span>
                <div>
                  <div className="logo-name">Mango Mane</div>
                  <div className="logo-tagline">Season's Finest</div>
                </div>
              </div>
              <p className="footer-desc">
                Premium mangoes and seasonal specialties delivered fresh
                to your doorstep in Bangalore. Straight from our farms.
              </p>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-heading">Shop</h4>
              <nav className="footer-links">
                <Link to="/products/mangoes">Mangoes</Link>
                <Link to="/products/sweets">Sweets</Link>
                <Link to="/products/fruits">Fresh Fruits</Link>
                <Link to="/cart">Your Cart</Link>
              </nav>
            </div>

            {/* Contact */}
            <div className="footer-section">
              <h4 className="footer-heading">Contact Us</h4>
              <div className="footer-contact">
                <a href="tel:+919876543210" className="contact-item">
                  <Phone size={16} />
                  <span>+91 95906 77077</span>
                </a>
                <a href="https://wa.me/919590677077?text=Hi%2C%20I%27m%20interested%20in%20ordering%20mangoes%20from%20Mango%20Mane%20%F0%9F%A5%AD" target="_blank" rel="noopener noreferrer" className="contact-item">
                  <MessageCircle size={16} />
                  <span>WhatsApp Us</span>
                </a>
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>Delivering across Bangalore</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Mango Mane. All rights reserved.</p>
            <p className="footer-credit">
              Made with <Heart size={12} fill="currentColor" /> by Shrinidhi Katti
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
