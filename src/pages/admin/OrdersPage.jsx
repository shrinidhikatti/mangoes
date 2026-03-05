import { useState, useEffect } from 'react';
import { Search, Phone, MapPin, Copy, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../services/dataService';
import { formatPrice, formatDateShort } from '../../utils/helpers';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../config/constants';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './OrdersPage.css';

const statusFlow = ['confirmed', 'packed', 'out_for_delivery', 'delivered'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const ords = await getOrders();
        setOrders(ords);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filtered = orders.filter(o => {
    if (filterStatus !== 'all' && o.orderStatus !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.orderNumber?.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q);
    }
    return true;
  });

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: newStatus,
              statusHistory: [...(o.statusHistory || []), { status: newStatus, timestamp: new Date().toISOString(), note: '' }],
              updatedAt: new Date().toISOString()
            }
          : o
      ));
    } catch (err) {
      console.error('Status update failed:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading orders..." />;

  return (
    <div className="admin-orders">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>{orders.length} total orders</p>
        </div>
      </div>

      <div className="orders-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by order #, name, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="status-filters">
          <button
            className={`filter-chip ${filterStatus === 'all' ? 'filter-chip--active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({orders.length})
          </button>
          {statusFlow.map(status => {
            const count = orders.filter(o => o.orderStatus === status).length;
            return (
              <button
                key={status}
                className={`filter-chip ${filterStatus === status ? 'filter-chip--active' : ''}`}
                onClick={() => setFilterStatus(status)}
                style={filterStatus === status ? { background: `${ORDER_STATUS_COLORS[status]}15`, color: ORDER_STATUS_COLORS[status], borderColor: `${ORDER_STATUS_COLORS[status]}40` } : {}}
              >
                {ORDER_STATUS_LABELS[status]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="orders-list">
        {filtered.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
              <div className="order-basic">
                <div className="order-id-col">
                  <span className="order-num">{order.orderNumber}</span>
                  <span className="order-time">{formatDateShort(order.createdAt)}</span>
                </div>
                <div className="order-customer-col">
                  <span className="oc-name">{order.customer?.name}</span>
                  <span className="oc-items">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="order-amount-col">
                  <span className="oa-total">{formatPrice(order.totalAmount)}</span>
                  <span className="oa-delivery">{order.deliveryCharge === 0 ? 'Free delivery' : `+${formatPrice(order.deliveryCharge)} delivery`}</span>
                </div>
                <div className="order-status-col">
                  <span className="status-badge" style={{ background: `${ORDER_STATUS_COLORS[order.orderStatus]}15`, color: ORDER_STATUS_COLORS[order.orderStatus] }}>
                    {ORDER_STATUS_LABELS[order.orderStatus]}
                  </span>
                </div>
                <div className="order-expand">
                  {expandedOrder === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="order-details">
                <div className="order-details-grid">
                  <div className="od-section">
                    <h4>Items Ordered</h4>
                    <div className="od-items">
                      {order.items?.map((item, i) => (
                        <div key={i} className="od-item">
                          <span className="odi-name">{item.productName}</span>
                          <span className="odi-variant">{item.variantLabel} x {item.quantity}</span>
                          <span className="odi-price">{formatPrice(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="od-section">
                    <h4>Customer Details</h4>
                    <div className="od-contact">
                      <div className="od-field">
                        <Phone size={14} />
                        <span>{order.customer?.phone}</span>
                        <button className="copy-btn" onClick={() => copyToClipboard(order.customer?.phone)} title="Copy"><Copy size={12} /></button>
                      </div>
                      <div className="od-field">
                        <MapPin size={14} />
                        <span>{order.deliveryAddress?.fullAddress}, {order.deliveryAddress?.pincode}</span>
                        <button className="copy-btn" onClick={() => copyToClipboard(`${order.deliveryAddress?.fullAddress}, ${order.deliveryAddress?.landmark || ''}, ${order.deliveryAddress?.pincode}`)} title="Copy"><Copy size={12} /></button>
                      </div>
                      {order.deliveryAddress?.landmark && (
                        <span className="od-landmark">Landmark: {order.deliveryAddress.landmark}</span>
                      )}
                    </div>
                  </div>

                  <div className="od-section">
                    <h4>Update Status</h4>
                    <div className="status-timeline">
                      {statusFlow.map((status, i) => {
                        const currentIdx = statusFlow.indexOf(order.orderStatus);
                        const isDone = i <= currentIdx;
                        const isNext = i === currentIdx + 1;
                        return (
                          <div key={status} className={`timeline-step ${isDone ? 'step-done' : ''} ${isNext ? 'step-next' : ''}`}>
                            <div className="step-dot" />
                            <span className="step-label">{ORDER_STATUS_LABELS[status]}</span>
                            {isNext && (
                              <Button size="sm" onClick={() => handleUpdateStatus(order.id, status)}>
                                Mark as {ORDER_STATUS_LABELS[status]}
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="od-meta">
                      <span><Clock size={13} /> Est. delivery: {formatDateShort(order.estimatedDeliveryDate)}</span>
                      <span>Mode: <strong>{order.deliveryMode}</strong></span>
                      {order.razorpayPaymentId && <span>Payment: <strong>{order.razorpayPaymentId}</strong></span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state" style={{ padding: '3rem' }}><p>No orders found</p></div>
        )}
      </div>
    </div>
  );
}
