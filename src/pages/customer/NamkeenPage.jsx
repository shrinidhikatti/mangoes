import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useCart } from '../../context/CartContext';
import './NamkeenPage.css';

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealSection({ children, className = '' }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`nk-reveal ${visible ? 'nk-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

const products = [
  {
    id: 'prod-7',
    name: 'Barik Sev',
    eyebrow: 'Namkeen',
    aka: <>Also known as <em>Nylon Sev</em></>,
    image: '/bshev.jpeg',
    imageAlt: 'Barik Sev - Nylon Sev',
    desc: [
      'A popular namkeen snack loved for its thin, crispy texture and incredible versatility. Made from gram flour and seasoned to perfection, it is the go-to savoury topping for chaats like bhel, masala puri, pani puri, poha, and upma — or enjoyed on its own as a satisfying crunch.',
      'Also relished as a topping with pav bhaji, misal pav, and usal pav. Once you start, you simply can\'t stop.',
    ],
    tags: ['Gram Flour', 'Crispy & Thin', 'Chaat Topping', 'Versatile'],
    variants: [
      { label: '150 gm Pack', price: 80, weight: 0.15 },
      { label: '300 gm Pack', price: 150, weight: 0.30 },
      { label: '500 gm Pack', price: 230, weight: 0.50 },
    ],
  },
  {
    id: 'prod-8',
    name: 'Chota Mixture',
    eyebrow: 'Tea-Time Favourite',
    aka: <>Everyone's favourite <em>time-pass</em> snack</>,
    image: '/cmixture.jpeg',
    imageAlt: 'Chota Mixture',
    desc: [
      'Made from gram flour with fried parched rice, chickpeas, and groundnuts, this is the perfect tea-time companion. Mildly spicy, it can be used as a topping for misal or mixed with puffed rice for an instant snack.',
      "Since it's not too spicy, even kids enjoy munching on it. Prepared in small batches so that it retains its freshness always.",
    ],
    tags: ['Gram Flour', 'Mildly Spicy', 'Small Batch', 'Kid-Friendly'],
    variants: [
      { label: '150 gm Pack', price: 80, weight: 0.15 },
      { label: '300 gm Pack', price: 150, weight: 0.30 },
      { label: '500 gm Pack', price: 230, weight: 0.50 },
    ],
  },
  {
    id: 'prod-9',
    name: 'Masala Toast',
    eyebrow: 'Belagavi Special',
    aka: <>The crunchiest snack from <em>Belagavi</em></>,
    image: '/mtoast.jpeg',
    imageAlt: 'Masala Toast',
    desc: [
      'Bread pieces roasted to get the crunchiest, crispiest texture, then coated with a special dry chutney powder. This lip-smacking snack is enjoyed with a sip of tea in the evening or as a wholesome breakfast.',
      "A true Belagavi classic that captures the essence of North Karnataka's street food culture in every bite.",
    ],
    tags: ['Crunchy', 'Dry Chutney Coated', 'Tea-Time', 'Breakfast'],
    variants: [
      { label: '200 gm Pack', price: 100, weight: 0.20 },
      { label: '400 gm Pack', price: 180, weight: 0.40 },
    ],
  },
  {
    id: 'prod-10',
    name: 'Plain Toast',
    eyebrow: 'Classic Crunch',
    aka: <>Simple, delicious, <em>anytime</em> snack</>,
    image: '/ptoast.jpeg',
    imageAlt: 'Plain Toast',
    desc: [
      'Made from high-quality bread and baked to golden, crispy perfection, these toasts offer a satisfying crunch with every bite. Whether you enjoy them plain, with butter, or topped with your favourite spreads, it complements a variety of flavours.',
      'It can also be added to a variety of soups for that extra crunch and texture. A pantry staple that never goes out of style.',
    ],
    tags: ['Golden Baked', 'Versatile', 'Soup Pairing', 'Everyday Snack'],
    variants: [
      { label: '200 gm Pack', price: 80, weight: 0.20 },
      { label: '400 gm Pack', price: 150, weight: 0.40 },
    ],
  },
  {
    id: 'prod-11',
    name: 'Khari Biscuit',
    eyebrow: 'Tea-Time Classic',
    aka: <>Melts in your mouth like <em>butter</em></>,
    image: '/kbiscut.jpeg',
    imageAlt: 'Khari Biscuit',
    desc: [
      'Our eggless khari biscuits melt in the mouth like butter. Made from all-purpose flour, they are loved by both kids and adults alike. Crunchy, flaky, and light on the stomach — the perfect tea-time companion.',
      'Each bite delivers layer upon layer of buttery, crispy goodness that pairs beautifully with your evening chai.',
    ],
    tags: ['Eggless', 'Flaky & Buttery', 'Light', 'Kid-Friendly'],
    variants: [
      { label: '150 gm Pack', price: 70, weight: 0.15 },
      { label: '300 gm Pack', price: 130, weight: 0.30 },
    ],
  },
  {
    id: 'prod-12',
    name: 'Methi Khari',
    eyebrow: 'With a Twist',
    aka: <>Khari biscuit with a <em>fenugreek</em> twist</>,
    image: '/mbiscut.jpeg',
    imageAlt: 'Methi Khari Biscuit',
    desc: [
      'This is a khari biscuit with a twist — infused with the unique flavour of fenugreek (methi). This irresistible taste won\'t let you eat just one. Your heart will always crave for more.',
      "Made from all-purpose flour, it's loved by both kids and adults. Crunchy, flavourful, and light on the stomach — the best tea-time snack with an aromatic edge.",
    ],
    tags: ['Fenugreek Flavour', 'Eggless', 'Crunchy', 'Aromatic'],
    variants: [
      { label: '150 gm Pack', price: 80, weight: 0.15 },
      { label: '300 gm Pack', price: 150, weight: 0.30 },
    ],
  },
];

function AddToCartPanel({ product }) {
  const { addItem } = useCart();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(
      { id: product.id, name: product.name, images: [product.image] },
      product.variants[selectedVariantIdx]
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const selected = product.variants[selectedVariantIdx];

  return (
    <div className="nk-cart-panel">
      <div className="nk-variant-selector">
        {product.variants.map((v, i) => (
          <button
            key={v.label}
            className={`nk-variant-btn ${i === selectedVariantIdx ? 'nk-variant-btn--active' : ''}`}
            onClick={() => setSelectedVariantIdx(i)}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className="nk-cart-row">
        <span className="nk-price">₹{selected.price}</span>
        <button
          className={`nk-add-btn ${added ? 'nk-add-btn--added' : ''}`}
          onClick={handleAdd}
        >
          {added ? <><Check size={16} /> Added!</> : <><ShoppingBag size={16} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
}

export default function NamkeenPage() {
  const [heroRef, heroVisible] = useReveal();

  return (
    <div className="nk-page">
      {/* Hero */}
      <section className="nk-hero" ref={heroRef}>
        <div className="nk-hero-bg" />
        <div className={`container nk-hero-inner ${heroVisible ? 'nk-visible' : ''}`}>
          <span className="nk-hero-eyebrow">Authentic Belagavi</span>
          <h1 className="nk-hero-title">
            Namkeen <span className="nk-hero-accent">Specials</span>
          </h1>
          <p className="nk-hero-subtitle">
            Handcrafted savoury snacks from North Karnataka — crispy, flavourful, and made in small batches
          </p>
        </div>
      </section>

      {/* Product Sections */}
      {products.map((product, idx) => (
        <RevealSection
          key={product.name}
          className={`nk-product-section ${idx % 2 !== 0 ? 'nk-product-section--alt' : ''}`}
        >
          <div className="container">
            <div className={`nk-product-row ${idx % 2 !== 0 ? 'nk-product-row--reverse' : ''}`}>
              <div className={`nk-product-img-wrap ${idx % 2 === 0 ? 'nk-img--left' : 'nk-img--right'}`}>
                <div className="nk-product-img-frame">
                  <img src={product.image} alt={product.imageAlt} />
                </div>
                <div className="nk-product-img-accent" />
              </div>
              <div className="nk-product-info">
                <span className="nk-eyebrow">{product.eyebrow}</span>
                <h2 className="nk-product-title">{product.name}</h2>
                <p className="nk-product-aka">{product.aka}</p>
                {product.desc.map((p, i) => (
                  <p key={i} className="nk-product-desc">{p}</p>
                ))}
                <div className="nk-product-tags">
                  {product.tags.map(tag => <span key={tag}>{tag}</span>)}
                </div>
                <AddToCartPanel product={product} />
              </div>
            </div>
          </div>
        </RevealSection>
      ))}

      {/* CTA */}
      <RevealSection className="nk-cta">
        <div className="container">
          <div className="nk-cta-card">
            <h2>Craving something crunchy?</h2>
            <p>
              From crispy sev to buttery khari — authentic Belagavi namkeen delivered fresh to your doorstep.
            </p>
            <Link to="/cart">
              <Button size="lg" icon={<ArrowRight size={18} />}>
                View Cart &amp; Checkout
              </Button>
            </Link>
          </div>
        </div>
      </RevealSection>
    </div>
  );
}
