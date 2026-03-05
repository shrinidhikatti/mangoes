import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, MapPin, Phone } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Header.css';

export default function Header() {
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <>
      {/* Top bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-item">
            <MapPin size={13} />
            <span>Delivering across Bangalore</span>
          </div>
          <div className="top-bar-item">
            <Phone size={13} />
            <span>+91 95906 77077</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="header-logo">
            <span className="logo-icon">🥭</span>
            <div className="logo-text">
              <span className="logo-name">Mango Mane</span>
              <span className="logo-tagline">Season's Finest</span>
            </div>
          </Link>

          <nav className={`header-nav ${menuOpen ? 'header-nav--open' : ''}`}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-link--active' : ''}`}>
              Home
            </Link>
            <Link to="/products/mangoes" className={`nav-link ${location.pathname.includes('mangoes') ? 'nav-link--active' : ''}`}>
              Mangoes
            </Link>
            <Link to="/products/sweets" className={`nav-link ${location.pathname.includes('sweets') ? 'nav-link--active' : ''}`}>
              Sweets
            </Link>
            <Link to="/products/fruits" className={`nav-link ${location.pathname.includes('fruits') ? 'nav-link--active' : ''}`}>
              Fruits
            </Link>
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-button">
              <ShoppingBag size={22} strokeWidth={1.8} />
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </Link>

            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}
