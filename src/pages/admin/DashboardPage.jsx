import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, IndianRupee, Package, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { getOrders, getProducts } from '../../services/dataService';
import { formatPrice, formatDateShort } from '../../utils/helpers';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../config/constants';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './DashboardPage.css';

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ords, prods] = await Promise.all([
          getOrders(),
          getProducts()
        ]);
        setOrders(ords);
        setProducts(prods);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner size="lg" text="Loading dashboard..." />;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus !== 'delivered').length;
  const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10);

  const stats = [
    { label: "Today's Orders", value: orders.length, icon: <ShoppingCart size={22} />, color: 'var(--gold-500)', bg: 'var(--gold-50)' },
    { label: 'Revenue', value: formatPrice(totalRevenue), icon: <IndianRupee size={22} />, color: 'var(--green-500)', bg: 'var(--green-50)' },
    { label: 'Pending Delivery', value: pendingOrders, icon: <Clock size={22} />, color: 'var(--saffron-500)', bg: '#FEE2D5' },
    { label: 'Low Stock Items', value: lowStockProducts.length, icon: <AlertTriangle size={22} />, color: '#DC2626', bg: '#FEE2E2' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className={`stat-card animate-fade-in-up delay-${i + 1}`}>
            <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card animate-fade-in-up delay-2">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="card-link">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map(order => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-number">{order.orderNumber}</span>
                      <span className="order-date">{formatDateShort(order.createdAt)}</span>
                    </td>
                    <td>
                      <span className="customer-name">{order.customer?.name}</span>
                      <span className="customer-phone">{order.customer?.phone}</span>
                    </td>
                    <td className="amount">{formatPrice(order.totalAmount)}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: `${ORDER_STATUS_COLORS[order.orderStatus]}15`,
                          color: ORDER_STATUS_COLORS[order.orderStatus]
                        }}
                      >
                        {ORDER_STATUS_LABELS[order.orderStatus]}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-card animate-fade-in-up delay-3">
          <div className="card-header">
            <h3>Stock Alerts</h3>
            <Link to="/admin/products" className="card-link">Manage <ArrowRight size={14} /></Link>
          </div>
          {lowStockProducts.length > 0 ? (
            <div className="stock-alerts">
              {lowStockProducts.map(product => (
                <div key={product.id} className="stock-alert-item">
                  <div className="stock-product">
                    <img src={product.images?.[0]} alt={product.name} className="stock-thumb" />
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.stockQuantity} {product.unit} remaining</span>
                    </div>
                  </div>
                  <Badge variant="saffron" size="sm">Low Stock</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Package size={32} />
              <p>All products are well stocked!</p>
            </div>
          )}

          <div className="quick-products">
            <h4>Products Overview</h4>
            <div className="product-stats">
              <div className="product-stat">
                <span className="ps-value">{products.filter(p => p.isAvailable).length}</span>
                <span className="ps-label">Active</span>
              </div>
              <div className="product-stat">
                <span className="ps-value">{products.filter(p => !p.isAvailable).length}</span>
                <span className="ps-label">Inactive</span>
              </div>
              <div className="product-stat">
                <span className="ps-value">{products.length}</span>
                <span className="ps-label">Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
