import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, Leaf, ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';
import { getActiveCategories, getAvailableProducts, getConfig } from '../../services/dataService';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './HomePage.css';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef(null);

  const carouselImages = [
    { src: '/m1.avif?v=2', alt: 'Fresh mangoes' },
    { src: '/m2.avif?v=2', alt: 'Premium alphonso mangoes' },
    { src: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=500&h=600&fit=crop', alt: 'Fresh mango harvest' },
    { src: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500&h=600&fit=crop', alt: 'Ripe alphonso mangoes' },
  ];

  const goToSlide = (index) => {
    setActiveSlide((index + carouselImages.length) % carouselImages.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, prods, cfg] = await Promise.all([
          getActiveCategories(),
          getAvailableProducts(),
          getConfig()
        ]);
        setCategories(cats);
        setProducts(prods);
        setConfig(cfg);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="page" text="Loading fresh picks..." />;
  }

  if (config && !config.isStoreOpen) {
    return (
      <div className="store-closed">
        <div className="store-closed-inner">
          <span className="store-closed-icon">🥭</span>
          <h1>{config.storeClosedMessage}</h1>
          <p>Follow us for updates on the next season.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient" />
          <div className="hero-pattern" />
        </div>

        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge animate-fade-in-up">
              <Leaf size={14} />
              <span> Fresh Arrivals</span>
            </div>
            <h1 className="hero-title animate-fade-in-up delay-1">
              Season's finest,<br />
              <span className="hero-title-accent">at your</span> door.
            </h1>
            <p className="hero-subtitle animate-fade-in-up delay-2">
              Premium Alphonso mangoes, traditional sweets, and North Karnataka
              delicacies — harvested with care and delivered fresh across Bangalore.
            </p>
            <div className="hero-actions animate-fade-in-up delay-3">
              <Link to="/products/mangoes">
                <Button size="lg" icon={<ArrowRight size={18} />}>
                  Shop Mangoes
                </Button>
              </Link>
            </div>
            <div className="hero-trust animate-fade-in-up delay-3">
              {[
                { emoji: '🌿', label: 'Farm Fresh' },
                { emoji: '🚗', label: 'Same-Day Delivery' },
                { emoji: '⭐', label: 'Premium Quality' },
              ].map(t => (
                <div key={t.label} className="hero-trust-item">
                  <span>{t.emoji}</span>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual animate-fade-in-up delay-2">
            {/* Mobile: stacked image cards (like MrCakeBakers style) */}
            <div className="hero-mobile-cards">
              <div className="hero-card-main">
                {/* Carousel inside main card */}
                {carouselImages.map((img, i) => (
                  <div key={i} className={`hero-card-slide ${i === activeSlide ? 'active' : ''}`}>
                    <img src={img.src} alt={img.alt} loading="eager" />
                  </div>
                ))}
                <div className="hero-card-dots">
                  {carouselImages.map((_, i) => (
                    <span key={i} className={`hero-card-dot ${i === activeSlide ? 'active' : ''}`} />
                  ))}
                </div>
                <div className="hero-card-price">
                  <span>Starting from</span>
                  <strong>₹499/kg</strong>
                </div>
              </div>
              <div className="hero-card-tr">
                <img src="/m2.avif?v=2" alt="Premium mangoes" />
              </div>
              <div className="hero-card-bl">
                <img src="/m3.avif?v=2" alt="Alphonso mangoes" />
              </div>
              <div className="hero-card-float-tl">
                <span>🥭</span>
                <div>
                  <strong>Alphonso</strong>
                  <small>100% Natural</small>
                </div>
              </div>
              <div className="hero-card-float-br">
                <span>🚚</span>
                <div>
                  <strong>Free Delivery</strong>
                  <small>Above ₹{config?.deliveryCharges?.freeAbove || 500}</small>
                </div>
              </div>
            </div>

            <div className="hero-image-stack">
              <div className="hero-carousel">
                {carouselImages.map((img, i) => (
                  <div key={i} className={`hero-carousel-slide ${i === activeSlide ? 'active' : ''}`}>
                    <img src={img.src} alt={img.alt} />
                  </div>
                ))}
                <button
                  className="carousel-btn carousel-btn--prev"
                  onClick={() => { goToSlide(activeSlide - 1); clearInterval(timerRef.current); }}
                  aria-label="Previous"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="carousel-btn carousel-btn--next"
                  onClick={() => { goToSlide(activeSlide + 1); clearInterval(timerRef.current); }}
                  aria-label="Next"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="carousel-dots">
                  {carouselImages.map((_, i) => (
                    <button
                      key={i}
                      className={`carousel-dot ${i === activeSlide ? 'active' : ''}`}
                      onClick={() => { goToSlide(i); clearInterval(timerRef.current); }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="hero-image hero-image--secondary">
                <img
                  src="/m3.avif?v=2"
                  alt="Sun-ripened mangoes"
                />
              </div>
              <div className="hero-floating-card">
                <div className="floating-card-emoji">🚚</div>
                <div>
                  <strong>Free Delivery</strong>
                  <span>Orders above ₹{config?.deliveryCharges?.freeAbove || 500}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll" aria-hidden="true">
          <ArrowDown size={16} />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            {[
              { icon: <Truck size={24} />, title: 'Same Day Delivery', desc: 'Order before 8 PM' },
              { icon: <Shield size={24} />, title: 'Quality Guaranteed', desc: 'Farm fresh or refund' },
              { icon: <Clock size={24} />, title: 'Seasonal & Fresh', desc: 'Picked at peak ripeness' },
              { icon: <Leaf size={24} />, title: 'Direct from Farms', desc: 'No middlemen involved' }
            ].map((item, i) => (
              <div key={i} className={`trust-item animate-fade-in-up delay-${i + 1}`}>
                <div className="trust-icon">{item.icon}</div>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Explore our curated selection of North Karnataka's finest</p>
            </div>
          </div>
          <div className="category-grid">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/products/${cat.slug}`}
                className={`category-card animate-fade-in-up delay-${i + 1}`}
              >
                <div className="category-card-image">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <div className="category-card-gradient" />
                </div>
                <div className="category-card-content">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  <span className="category-card-link">
                    Browse <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="section products-section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Fresh Picks</h2>
                <p className="section-subtitle">Our most popular products this season</p>
              </div>
              <Link to="/products/mangoes" className="section-link">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="products-grid">
              {products.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-images">
              <div className="story-image story-image--large">
                <img
                  src="/m1.avif?v=2"
                  alt="Mango orchard"
                  loading="lazy"
                />
              </div>
              <div className="story-image story-image--small">
                <img
                  src="https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=300&h=300&fit=crop"
                  alt="Fresh mangoes"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="story-content">
              <span className="story-label">Our Story</span>
              <h2 className="story-title">
                From our orchards,<br />
                straight to <em>your table</em>
              </h2>
              <p>
                We're a family that believes in the simple joy of fresh, naturally
                ripened fruit. Our mangoes are handpicked from family-owned orchards
                in North Karnataka — a region renowned for producing some of
                India's finest mangoes.
              </p>
              <p>
                No cold storage, no artificial ripening. Just sun-ripened goodness
                delivered to your doorstep in Bangalore within a day of harvest.
              </p>
              <div className="story-stats">
                <div className="stat">
                  <strong>500+</strong>
                  <span>Happy Customers</span>
                </div>
                <div className="stat">
                  <strong>3</strong>
                  <span>Mango Varieties</span>
                </div>
                <div className="stat">
                  <strong>24hr</strong>
                  <span>Farm to Door</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Don't miss the mango season!</h2>
              <p>
                Alphonso mangoes are available for a limited time — April to July.
                Order now and taste the difference of farm-fresh.
              </p>
              <Link to="/products/mangoes">
                <Button size="lg" icon={<ArrowRight size={18} />}>
                  Order Fresh Mangoes
                </Button>
              </Link>
            </div>
            <div className="cta-decoration">
              <span className="cta-emoji">🥭</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
