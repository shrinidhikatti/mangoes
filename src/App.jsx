import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import AdminGuard from './components/admin/AdminGuard';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ProductListingPage from './pages/customer/ProductListingPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import SettingsPage from './pages/admin/SettingsPage';

function CustomerLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
          <Route path="/products/:category" element={<CustomerLayout><ProductListingPage /></CustomerLayout>} />
          <Route path="/product/:id" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
          <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
          <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
          <Route path="/order-confirmed" element={<CustomerLayout><OrderConfirmationPage /></CustomerLayout>} />

          {/* Admin Routes (password protected) */}
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
