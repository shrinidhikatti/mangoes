import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getConfig } from '../../services/dataService';
import { formatPrice, calculateDeliveryCharge } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './CartPage.css';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const cfg = await getConfig();
        setConfig(cfg);
      } catch (err) {
        console.error('Failed to load config:', err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-inner animate-scale-in">
          <div className="cart-empty-icon">
            <ShoppingBag size={48} strokeWidth={1.2} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any fresh produce yet.</p>
          <Link to="/">
            <Button size="lg" icon={<ArrowLeft size={18} />}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !config) {
    return <LoadingSpinner size="page" />;
  }

  const deliveryCharge = calculateDeliveryCharge(subtotal, config);
  const total = subtotal + deliveryCharge;
  const freeDeliveryGap = config.deliveryCharges.freeAbove - subtotal;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header animate-fade-in">
          <h1>Your Cart</h1>
          <span className="cart-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {freeDeliveryGap > 0 && (
              <div className="free-delivery-bar animate-fade-in">
                <Truck size={16} />
                <span>Add <strong>{formatPrice(freeDeliveryGap)}</strong> more for <strong>free delivery!</strong></span>
                <div className="delivery-progress">
                  <div
                    className="delivery-progress-fill"
                    style={{ width: `${Math.min(100, (subtotal / config.deliveryCharges.freeAbove) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {items.map((item, i) => (
              <div key={item.id} className={`cart-item animate-fade-in-up delay-${Math.min(i + 1, 4)}`}>
                <div className="cart-item-image">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} />
                  ) : (
                    <div className="cart-item-placeholder">🥭</div>
                  )}
                </div>

                <div className="cart-item-details">
                  <Link to={`/product/${item.productId}`} className="cart-item-name">
                    {item.productName}
                  </Link>
                  <span className="cart-item-variant">{item.variantLabel}</span>
                  <span className="cart-item-unit-price">{formatPrice(item.price)} each</span>
                </div>

                <div className="cart-item-quantity">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>

                <div className="cart-item-price">
                  <span className="item-subtotal">{formatPrice(item.price * item.quantity)}</span>
                  <button className="remove-btn" onClick={() => removeItem(item.id)} aria-label="Remove item">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary animate-fade-in-up delay-2">
            <div className="summary-card">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span className={deliveryCharge === 0 ? 'free-tag' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                  </span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {subtotal < config.minimumOrderValue ? (
                <div className="min-order-warning">
                  Minimum order is {formatPrice(config.minimumOrderValue)}. Add {formatPrice(config.minimumOrderValue - subtotal)} more.
                </div>
              ) : (
                <Link to="/checkout">
                  <Button size="lg" fullWidth icon={<ArrowRight size={18} />}>
                    Proceed to Checkout
                  </Button>
                </Link>
              )}

              <Link to="/" className="continue-shopping">
                <ArrowLeft size={14} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
