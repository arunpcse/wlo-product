import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/ToastContainer';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmPage from './pages/OrderConfirmPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <ProductProvider>
              <CartProvider>
                <div className="app">
                  <Header />
                  <CartDrawer />
                  <ToastContainer />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirm" element={<OrderConfirmPage />} />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
                  </Routes>
                  <footer className="footer">
                    <p>© 2025 <strong>World Line Out</strong> — Premium Mobile Accessories</p>
                    <p className="footer-sub">📱 Quality You Can Trust | WhatsApp: +91 93610 46703</p>
                  </footer>
                </div>
              </CartProvider>
            </ProductProvider>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
