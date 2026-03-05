import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getConfig, createOrder } from '../../services/dataService';
import { formatPrice, calculateDeliveryCharge, getEstimatedDeliveryDate, formatDate, generateOrderNumber } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: user?.displayName || '',
    phone: '',
    fullAddress: '',
    landmark: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});
  const [pincodeValid, setPincodeValid] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

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

  if (loading) return <LoadingSpinner size="page" />;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const deliveryCharge = config ? calculateDeliveryCharge(subtotal, config) : 50;
  const total = subtotal + deliveryCharge;
  const estimatedDate = getEstimatedDeliveryDate(config?.orderCutoffTime || '20:00');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setPaymentError('');

    if (name === 'pincode' && value.length === 6 && config) {
      setPincodeValid(config.serviceablePincodes.includes(value));
    } else if (name === 'pincode') {
      setPincodeValid(null);
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace('+91', '').trim()))
      newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!form.fullAddress.trim()) newErrors.fullAddress = 'Address is required';
    if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(form.pincode))
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    else if (config && !config.serviceablePincodes.includes(form.pincode))
      newErrors.pincode = "Sorry, we don't deliver to this area yet";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validate()) return;

    setProcessing(true);
    setPaymentError('');
    const orderNumber = generateOrderNumber();

    try {
      // Create order directly (Razorpay will be enabled with live keys in production)
      const orderData = {
        orderNumber,
        customer: {
          name: form.name,
          phone: `+91${form.phone}`,
          email: ''
        },
        deliveryAddress: {
          fullAddress: form.fullAddress,
          landmark: form.landmark,
          pincode: form.pincode,
          city: 'Bangalore'
        },
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          variantLabel: item.variantLabel,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        })),
        subtotal,
        deliveryCharge,
        totalAmount: total,
        paymentStatus: 'pending',
        deliveryMode: 'self',
        estimatedDeliveryDate: estimatedDate.toISOString().split('T')[0],
        userId: user?.uid || null
      };

      await createOrder(orderData);

      // Step 3: Clear cart and redirect
      clearCart();
      navigate('/order-confirmed', {
        state: {
          orderNumber,
          total,
          estimatedDate: estimatedDate.toISOString(),
          customerName: form.name
        }
      });

    } catch (err) {
      console.error('Order error:', err);
      if (err.message?.includes('Insufficient stock')) {
        setPaymentError('Some items are out of stock. Please update your cart.');
      } else {
        setPaymentError('Failed to place order. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <Link to="/cart" className="checkout-back animate-fade-in">
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <h1 className="checkout-title animate-fade-in-up">Checkout</h1>

        <div className="checkout-layout">
          {/* Delivery Details */}
          <div className="checkout-form-section animate-fade-in-up delay-1">
            <div className="form-card">
              <h3 className="form-card-title">
                <MapPin size={20} />
                Delivery Details
              </h3>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <div className="phone-input">
                    <span className="phone-prefix">+91</span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className={errors.phone ? 'input-error' : ''}
                    />
                  </div>
                  {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="fullAddress">Delivery Address *</label>
                  <textarea
                    id="fullAddress"
                    name="fullAddress"
                    value={form.fullAddress}
                    onChange={handleChange}
                    placeholder="House/Flat no, Street, Area, Locality"
                    rows={3}
                    className={errors.fullAddress ? 'input-error' : ''}
                  />
                  {errors.fullAddress && <span className="error-msg">{errors.fullAddress}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="landmark">Landmark (Optional)</label>
                  <input
                    id="landmark"
                    name="landmark"
                    type="text"
                    value={form.landmark}
                    onChange={handleChange}
                    placeholder="Near Forum Mall, etc."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="560034"
                    maxLength={6}
                    className={`${pincodeValid === true ? 'input-success' : ''} ${pincodeValid === false ? 'input-error' : ''} ${errors.pincode ? 'input-error' : ''}`}
                  />
                  {pincodeValid === true && <span className="success-msg">✓ We deliver here!</span>}
                  {pincodeValid === false && <span className="error-msg">✗ We do not deliver here</span>}
                  {pincodeValid === null && errors.pincode && <span className="error-msg">{errors.pincode}</span>}
                </div>
              </div>
            </div>

            <div className="delivery-estimate">
              <Calendar size={18} />
              <div>
                <strong>Estimated Delivery</strong>
                <span>{formatDate(estimatedDate)}</span>
              </div>
            </div>

            {paymentError && (
              <div className="payment-error">
                {paymentError}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="checkout-summary animate-fade-in-up delay-2">
            <div className="summary-card">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-items">
                {items.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.productName}</span>
                      <span className="summary-item-variant">{item.variantLabel} x {item.quantity}</span>
                    </div>
                    <span className="summary-item-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-divider" />

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

              <Button
                size="lg"
                fullWidth
                onClick={handlePayment}
                loading={processing}
                disabled={processing || pincodeValid === false}
                icon={<Lock size={16} />}
              >
                {processing ? 'Processing...' : `Pay ${formatPrice(total)}`}
              </Button>

              <p className="secure-note">
                <Lock size={12} />
                Secure payment via Razorpay (UPI, Cards, Net Banking)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
