import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import wloLogo from '../assets/wlo-logo.png';

export default function Header() {
    const { cartCount, openCart } = useCart();
    const { isAdmin, logout } = useAuth();
    const { wishlistCount } = useWishlist();
    const location = useLocation();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
            setSearch('');
        }
    };

    return (
        <header className="hdr">
            {/* ── Top banner ───────────────── */}
            <div className="hdr-topbar">
                <span>🎉 FREE delivery on orders above ₹499 &nbsp;|&nbsp; Use code <strong>WLO10</strong> for 10% off</span>
            </div>

            {/* ── Main header ──────────────── */}
            <div className="hdr-main">
                <div className="hdr-container">
                    {/* Logo */}
                    <Link to="/" className="hdr-logo">
                        <img
                            src={wloLogo}
                            alt="WLO Accessories"
                            className="hdr-logo-img"
                        />
                    </Link>

                    {/* Search bar */}
                    <form className="hdr-search" onSubmit={handleSearch}>
                        <input
                            type="search"
                            className="hdr-search-input"
                            placeholder="Search for screen protectors, cables, cases..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="hdr-search-btn" aria-label="Search">
                            🔍
                        </button>
                    </form>

                    {/* Right actions */}
                    <div className="hdr-actions">
                        <Link to="/shop" className={`hdr-nav-link ${isActive('/shop') ? 'active' : ''}`}>
                            <span className="hdr-nav-icon">🏪</span>
                            <span className="hdr-nav-label">Shop</span>
                        </Link>

                        {isAdmin ? (
                            <>
                                <Link to="/admin" className={`hdr-nav-link ${isActive('/admin') ? 'active' : ''}`}>
                                    <span className="hdr-nav-icon">⚙️</span>
                                    <span className="hdr-nav-label">Admin</span>
                                </Link>
                                <Link to="/admin/orders" className={`hdr-nav-link ${isActive('/admin/orders') ? 'active' : ''}`}>
                                    <span className="hdr-nav-icon">📦</span>
                                    <span className="hdr-nav-label">Orders</span>
                                </Link>
                                <button className="hdr-nav-link hdr-logout" onClick={logout}>
                                    <span className="hdr-nav-icon">🚪</span>
                                    <span className="hdr-nav-label">Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link to="/admin/login" className={`hdr-nav-link ${isActive('/admin/login') ? 'active' : ''}`}>
                                <span className="hdr-nav-icon">👤</span>
                                <span className="hdr-nav-label">Admin</span>
                            </Link>
                        )}

                        {/* Wishlist */}
                        <Link to="/wishlist" className="hdr-icon-btn" aria-label="Wishlist">
                            ❤️
                            {wishlistCount > 0 && <span className="hdr-badge">{wishlistCount}</span>}
                        </Link>

                        {/* Cart */}
                        <button className="hdr-cart-btn" onClick={openCart} aria-label="Cart">
                            <span style={{ fontSize: 22 }}>🛒</span>
                            {cartCount > 0 && <span className="hdr-badge hdr-cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>}
                        </button>
                    </div>
                </div>

                {/* ── Nav tabs ──────────────── */}
                <nav className="hdr-nav-tabs">
                    <div className="hdr-nav-tabs-inner">
                        {['Screen Protection', 'Cables & Chargers', 'Audio', 'Phone Cases', 'Car Accessories', 'Powerbanks'].map((cat) => (
                            <Link
                                key={cat}
                                to={`/shop?category=${encodeURIComponent(cat)}`}
                                className="hdr-nav-tab"
                            >
                                {cat}
                            </Link>
                        ))}
                        <Link to="/shop" className="hdr-nav-tab hdr-nav-tab-sale">🔥 Sale</Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
