import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, FolderTree, Settings, Menu, X, LogOut, ChevronRight } from 'lucide-react';
import './AdminLayout.css';

const navItems = [
  { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', exact: true },
  { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
  { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
  { path: '/admin/categories', icon: <FolderTree size={20} />, label: 'Categories' },
  { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo">
            <span>🥭</span>
            <div>
              <strong>Mango Mane</strong>
              <span className="admin-role">Admin Panel</span>
            </div>
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive(item) ? 'admin-nav-item--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
              {isActive(item) && <ChevronRight size={14} className="nav-arrow" />}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item admin-nav-item--muted">
            <LogOut size={20} />
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="admin-topbar-right">
            <span className="admin-user">Admin</span>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
