import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Header() {
    const { cartCount, openCart } = useCart();
    const { isAdmin, logout } = useAuth();
    const { wishlistCount } = useWishlist();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <div className="logo-icon">📱</div>
                    <div className="logo-text">
                        <span className="logo-brand">World Line Out</span>
                        <span className="logo-sub">Mobile Accessories</span>
                    </div>
                </Link>

                <nav className="nav">
                    <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'active' : ''}`}>🏪 Shop</Link>

                    {isAdmin ? (
                        <>
                            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>⚙️ Admin</Link>
                            <Link to="/admin/orders" className={`nav-link ${isActive('/admin/orders') ? 'active' : ''}`}>📦 Orders</Link>
                            <button className="nav-link btn-logout" onClick={logout}>🚪 Logout</button>
                        </>
                    ) : (
                        <Link to="/admin/login" className={`nav-link ${isActive('/admin/login') ? 'active' : ''}`}>🔐 Admin</Link>
                    )}

                    {/* Wishlist icon */}
                    <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
                        ❤️
                        {wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
                    </Link>

                    {/* Cart icon */}
                    <button className="cart-btn" onClick={openCart} aria-label="Open Cart">
                        🛒
                        {cartCount > 0 && <span className="cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>}
                    </button>
                </nav>
            </div>
        </header>
    );
}
