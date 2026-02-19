import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';

function Stars({ rating }) {
    return (
        <span style={{ fontSize: 13, letterSpacing: 1 }}>
            {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ color: i < Math.round(rating) ? '#FF6B00' : '#D1D5DB' }}>★</span>
            ))}
        </span>
    );
}

export default function ProductCard({ product, showAdminActions, onEdit, onDelete }) {
    const { addToCart, openCart } = useCart();
    const { addToast } = useToast();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const inWish = isInWishlist(product._id);
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleAdd = (e) => {
        e.preventDefault();
        if (product.stock === 0) return;
        addToCart(product);
        addToast(`"${product.name}" added to cart 🛒`, 'success');
        openCart();
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        toggleWishlist(product);
        addToast(inWish ? 'Removed from wishlist' : 'Added to wishlist ❤️', inWish ? 'info' : 'success');
    };

    return (
        <article className="product-card">
            <Link to={`/product/${product._id}`} className="product-image-wrapper" style={{ display: 'block' }}>
                <img
                    src={product.image || 'https://placehold.co/300x225?text=No+Image'}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://placehold.co/300x225?text=No+Image'; }}
                />
                {/* Badges */}
                <div className="product-badges">
                    {discount > 0 && <span className="badge badge-sale">{discount}% OFF</span>}
                    {product.isNewArrival && <span className="badge badge-new">NEW</span>}
                    {product.isBestSeller && <span className="badge badge-best">BEST SELLER</span>}
                    {product.isFeatured && <span className="badge badge-featured">FEATURED</span>}
                    {product.stock > 0 && product.stock <= 5 && <span className="badge badge-limited">Only {product.stock} left</span>}
                </div>

                {product.stock === 0 && <div className="out-of-stock-badge">Out of Stock</div>}

                {!showAdminActions && (
                    <button className={`wishlist-btn ${inWish ? 'active' : ''}`} onClick={handleWishlist} title="Wishlist">
                        {inWish ? '❤️' : '🤍'}
                    </button>
                )}
            </Link>

            <div className="product-info">
                <span className="product-category-label">{product.category}</span>

                <h3 className="product-name">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                </h3>

                <p className="product-description">{product.description}</p>

                <div className="product-rating">
                    <Stars rating={product.rating || 4} />
                    <span className="rating-value">{product.rating || '4.0'}</span>
                    {product.reviewCount > 0 && (
                        <span className="review-count">({product.reviewCount})</span>
                    )}
                </div>

                <div className="product-footer">
                    <div>
                        <div className="product-price-row">
                            <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                            {product.originalPrice > 0 && (
                                <>
                                    <span className="product-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                    <span className="discount-text">{discount}% off</span>
                                </>
                            )}
                        </div>
                    </div>

                    {showAdminActions ? (
                        <div className="admin-actions">
                            <button className="btn btn-edit" onClick={() => onEdit(product)}>✏️</button>
                            <button className="btn btn-delete" onClick={() => onDelete(product)}>🗑️</button>
                        </div>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={handleAdd}
                            disabled={product.stock === 0}
                            style={{ padding: '8px 16px', fontSize: 12 }}
                        >
                            {product.stock === 0 ? 'Out of Stock' : '+ Add'}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
