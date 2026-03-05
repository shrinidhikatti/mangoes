import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Minus, Plus, ShoppingBag, Check, Truck, Shield, Clock } from 'lucide-react';
import { getProduct } from '../../services/dataService';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const p = await getProduct(id);
        setProduct(p);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="page" text="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;
  const isSoldOut = product.stockQuantity === 0 || !product.isAvailable;

  const handleAddToCart = () => {
    addItem(product, variant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-detail">
      <div className="container">
        <nav className="breadcrumb animate-fade-in">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/products/${product.category}`}>{product.category}</Link>
          <ChevronRight size={14} />
          <span>{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Image Gallery */}
          <div className="product-gallery animate-fade-in-up">
            <div className="gallery-main">
              <img src={product.images[activeImage]} alt={product.name} />
              {isSoldOut && (
                <div className="gallery-sold-out"><span>Sold Out</span></div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="gallery-thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`gallery-thumb ${i === activeImage ? 'gallery-thumb--active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info animate-fade-in-up delay-1">
            <span className="product-category-label">{product.category}</span>
            <h1 className="product-name">{product.name}</h1>

            {isLowStock && (
              <Badge variant="saffron" size="md">Only {product.stockQuantity} left — order soon!</Badge>
            )}

            <p className="product-description">{product.description}</p>

            <div className="variant-section">
              <h4 className="variant-label">Select Size</h4>
              <div className="variant-options">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    className={`variant-option ${i === selectedVariant ? 'variant-option--selected' : ''}`}
                    onClick={() => setSelectedVariant(i)}
                  >
                    <span className="variant-option-label">{v.label}</span>
                    <span className="variant-option-price">{formatPrice(v.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-section">
              <h4 className="quantity-label">Quantity</h4>
              <div className="quantity-control">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stockQuantity}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="product-purchase">
              <div className="product-total">
                <span className="total-label">Total</span>
                <span className="total-price">{formatPrice(variant.price * quantity)}</span>
              </div>
              <Button
                size="lg"
                fullWidth
                disabled={isSoldOut}
                onClick={handleAddToCart}
                icon={added ? <Check size={20} /> : <ShoppingBag size={20} />}
                className={added ? 'btn--added' : ''}
              >
                {isSoldOut ? 'Sold Out' : added ? 'Added to Cart!' : 'Add to Cart'}
              </Button>
            </div>

            <div className="product-benefits">
              <div className="benefit-item">
                <Truck size={18} />
                <span>Free delivery above ₹500</span>
              </div>
              <div className="benefit-item">
                <Clock size={18} />
                <span>Order before 8 PM for next-day delivery</span>
              </div>
              <div className="benefit-item">
                <Shield size={18} />
                <span>Freshness guaranteed or full refund</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
