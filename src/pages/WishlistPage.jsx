import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { addToast } = useToast();

    const moveToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product._id);
        addToast(`"${product.name}" moved to cart 🛒`, 'success');
    };

    if (wishlist.length === 0) {
        return (
            <main className="page wishlist-page">
                <div className="empty-state" style={{ padding: '4rem' }}>
                    <div className="empty-icon">🤍</div>
                    <h2>Your Wishlist is Empty</h2>
                    <p>Save items you love and buy them later.</p>
                    <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Shopping</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="page wishlist-page">
            <div className="page-header">
                <h1>❤️ My Wishlist <span className="badge-count">{wishlist.length}</span></h1>
            </div>
            <div className="products-grid">
                {wishlist.map((product) => (
                    <article key={product._id} className="product-card">
                        <div className="product-image-wrapper">
                            <Link to={`/product/${product._id}`}>
                                <img
                                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                    alt={product.name}
                                    className="product-image"
                                    loading="lazy"
                                />
                            </Link>
                            <span className="product-category-badge">{product.category}</span>
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">
                                <Link to={`/product/${product._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {product.name}
                                </Link>
                            </h3>
                            <div className="product-price-row">
                                <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                                {product.originalPrice && (
                                    <span className="product-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                )}
                            </div>
                            <div className="wishlist-card-actions">
                                <button className="btn btn-primary" onClick={() => moveToCart(product)} disabled={product.stock === 0}>
                                    {product.stock === 0 ? 'Out of Stock' : '🛒 Move to Cart'}
                                </button>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => { removeFromWishlist(product._id); addToast('Removed from wishlist', 'info'); }}
                                >
                                    🗑️ Remove
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}
