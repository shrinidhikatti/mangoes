import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, MapPin, Phone, User, LogOut, ClipboardList } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export default function Header() {
  const { itemCount } = useCart();
  const { user, logOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogOut = async () => {
    await logOut();
    setUserMenuOpen(false);
    navigate('/');
  };

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
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-link--active' : ''}`}>Home</Link>
            <Link to="/products/mangoes" className={`nav-link ${location.pathname.includes('mangoes') ? 'nav-link--active' : ''}`}>Mangoes</Link>
            <Link to="/products/sweets" className={`nav-link ${location.pathname.includes('sweets') ? 'nav-link--active' : ''}`}>Sweets</Link>
            <Link to="/products/fruits" className={`nav-link ${location.pathname.includes('fruits') ? 'nav-link--active' : ''}`}>Fruits</Link>
          </nav>

          <div className="header-actions">
            {/* User menu */}
            {user ? (
              <div className="user-menu-wrap" ref={userMenuRef}>
                <button className="user-avatar-btn" onClick={() => setUserMenuOpen(!userMenuOpen)} aria-label="Account menu">
                  <div className="user-avatar">
                    {user.displayName ? user.displayName[0].toUpperCase() : <User size={16} />}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <span className="user-dropdown-name">{user.displayName || 'Account'}</span>
                      <span className="user-dropdown-email">{user.email}</span>
                    </div>
                    <Link to="/account/orders" className="user-dropdown-item">
                      <ClipboardList size={15} />
                      My Orders
                    </Link>
                    <button className="user-dropdown-item user-dropdown-item--danger" onClick={handleLogOut}>
                      <LogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="header-login-btn">
                <User size={16} />
                <span>Login</span>
              </Link>
            )}

            <Link to="/cart" className="cart-button">
              <ShoppingBag size={22} strokeWidth={1.8} />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>

            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}
