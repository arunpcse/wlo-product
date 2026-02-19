import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/ToastContainer';
import AdminRoute from './components/AdminRoute';
import ShopPage from './pages/ShopPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmPage from './pages/OrderConfirmPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <div className="app">
                <Header />
                <CartDrawer />
                <ToastContainer />
                <Routes>
                  <Route path="/" element={<ShopPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirm" element={<OrderConfirmPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                </Routes>
                <footer className="footer">
                  <p>© 2025 <strong>World Line Out</strong> — Premium Mobile Accessories</p>
                  <p className="footer-sub">📱 Quality You Can Trust | WhatsApp: +91 93610 46703</p>
                </footer>
              </div>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
