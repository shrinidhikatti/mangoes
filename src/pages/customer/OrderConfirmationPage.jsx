import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Calendar, Phone, ShoppingBag, UserPlus } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const { user } = useAuth();
  const order = location.state;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-card animate-scale-in">
          <div className="confirmation-icon">
            <CheckCircle size={56} />
          </div>

          <h1 className="confirmation-title">Order Confirmed!</h1>
          <p className="confirmation-subtitle">
            Thank you, <strong>{order.customerName}</strong>! Your order has been placed successfully.
          </p>

          <div className="confirmation-details">
            <div className="detail-item">
              <span className="detail-label">Order Number</span>
              <span className="detail-value detail-order-id">{order.orderNumber}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Amount Paid</span>
              <span className="detail-value">{formatPrice(order.total)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <Calendar size={14} /> Estimated Delivery
              </span>
              <span className="detail-value">{formatDate(order.estimatedDate)}</span>
            </div>
          </div>

          <div className="confirmation-note">
            <p>
              We'll contact you on WhatsApp/Phone before delivery. For any queries, call us:
            </p>
            <a href="tel:+919876543210" className="confirmation-phone">
              <Phone size={16} />
              +91 95906 77077
            </a>
          </div>

          {!user && (
            <div className="confirmation-signup-prompt">
              <UserPlus size={20} />
              <div>
                <strong>Save your order history</strong>
                <p>Create a free account to track this and future orders.</p>
              </div>
              <Link to="/login" state={{ mode: 'signup', returnTo: '/account/orders' }} className="btn btn--outline btn--sm">
                Create Account
              </Link>
            </div>
          )}

          <div className="confirmation-actions">
            <Link to="/">
              <Button size="lg" icon={<ShoppingBag size={18} />}>
                Continue Shopping
              </Button>
            </Link>
            {user && (
              <Link to="/account/orders">
                <Button variant="outline" size="lg" icon={<UserPlus size={18} />}>
                  View My Orders
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
