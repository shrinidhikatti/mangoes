import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Calendar, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByUser } from '../../services/dataService';
import { formatPrice, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import './OrderHistoryPage.css';

const STATUS_LABELS = {
  confirmed: { label: 'Confirmed', variant: 'info' },
  processing: { label: 'Processing', variant: 'warning' },
  out_for_delivery: { label: 'Out for Delivery', variant: 'warning' },
  delivered: { label: 'Delivered', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'error' },
};

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_LABELS[order.orderStatus] || { label: order.orderStatus, variant: 'info' };

  return (
    <div className="order-card">
      <div className="order-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="order-card-meta">
          <span className="order-number">#{order.orderNumber}</span>
          <span className="order-date">
            <Calendar size={13} />
            {order.createdAt?.toDate ? formatDate(order.createdAt.toDate()) : formatDate(order.createdAt)}
          </span>
        </div>
        <div className="order-card-right">
          <Badge variant={status.variant}>{status.label}</Badge>
          <span className="order-total">{formatPrice(order.totalAmount)}</span>
          <button className="order-expand-btn" aria-label="Toggle details">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="order-card-body">
          <div className="order-items">
            {order.items?.map((item, i) => (
              <div key={i} className="order-item-row">
                <span className="order-item-name">{item.productName}</span>
                <span className="order-item-variant">{item.variantLabel}</span>
                <span className="order-item-qty">× {item.quantity}</span>
                <span className="order-item-price">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="order-summary-rows">
            <div className="order-summary-row">
              <span>Delivery</span>
              <span>{order.deliveryCharge === 0 ? 'FREE' : formatPrice(order.deliveryCharge)}</span>
            </div>
            <div className="order-summary-row order-summary-total">
              <span>Total Paid</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
          <div className="order-address">
            <strong>Delivered to:</strong> {order.deliveryAddress?.fullAddress}, {order.deliveryAddress?.pincode}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrdersByUser(user.uid);
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchOrders();
  }, [user]);

  if (loading) return <LoadingSpinner size="page" text="Loading your orders..." />;

  return (
    <div className="order-history-page">
      <div className="container">
        <div className="order-history-header animate-fade-in">
          <div>
            <h1 className="order-history-title">Your Orders</h1>
            <p className="order-history-subtitle">Hi {user?.displayName?.split(' ')[0]} 👋 — here's your order history</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="order-history-empty animate-fade-in-up">
            <Package size={48} strokeWidth={1.2} />
            <h3>No orders yet</h3>
            <p>Your order history will appear here once you place an order.</p>
            <Link to="/products/mangoes" className="btn btn--primary btn--lg">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="order-list animate-fade-in-up">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
