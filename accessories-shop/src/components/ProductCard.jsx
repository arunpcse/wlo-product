import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';

// Real product photos from Unsplash per category
const CAT_IMAGES = {
    'Screen Protection': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&w=600&q=85',
    'Cables & Chargers': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&w=600&q=85',
    'Audio': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&w=600&q=85',
    'Phone Cases': 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?auto=format&w=600&q=85',
    'Car Accessories': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&w=600&q=85',
    'Powerbanks': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&w=600&q=85',
    'Power Banks': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&w=600&q=85',
    'default': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&w=600&q=85',
};

function imgFallback(e, category) {
    e.target.src = CAT_IMAGES[category] || CAT_IMAGES.default;
    e.target.onerror = null;
}

export default function ProductCard({ product, showAdminActions, onEdit, onDelete }) {
    const { addToCart, openCart } = useCart();
    const { addToast } = useToast();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const inWish = isInWishlist(product._id);
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const imgSrc = product.image && product.image.trim()
        ? product.image
        : (CAT_IMAGES[product.category] || CAT_IMAGES.default);

    const handleAdd = (e) => {
        e.preventDefault();
        if (product.stock === 0) return;
        addToCart(product);
        addToast(`"${product.name}" added to cart`, 'success');
        openCart();
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        toggleWishlist(product);
        addToast(inWish ? 'Removed from wishlist' : 'Added to wishlist', inWish ? 'info' : 'success');
    };

    return (
        <article className="sg-card">
            {/* Image Block */}
            <Link to={`/product/${product._id}`} className="sg-card-img-wrap">
                <img
                    src={imgSrc}
                    alt={product.name}
                    className="sg-card-img"
                    loading="lazy"
                    onError={(e) => imgFallback(e, product.category)}
                />

                {/* Badges */}
                <div className="sg-card-badges">
                    {discount > 0 && <span className="sg-badge sg-badge-sale">{discount}% OFF</span>}
                    {product.isNewArrival && <span className="sg-badge sg-badge-new">NEW</span>}
                    {product.isBestSeller && <span className="sg-badge sg-badge-best">BEST SELLER</span>}
                    {product.stock > 0 && product.stock <= 5 && (
                        <span className="sg-badge sg-badge-limited">Only {product.stock} left</span>
                    )}
                </div>

                {product.stock === 0 && <div className="sg-out-of-stock">OUT OF STOCK</div>}

                {!showAdminActions && (
                    <button
                        className={`sg-wishlist-btn ${inWish ? 'active' : ''}`}
                        onClick={handleWishlist}
                        title="Wishlist"
                    >
                        {inWish ? '♥' : '♡'}
                    </button>
                )}
            </Link>

            {/* Info below image */}
            <div className="sg-card-info">
                <p className="sg-card-category">{product.category}</p>
                <h3 className="sg-card-name">
                    <Link to={`/product/${product._id}`}>{product.name.toUpperCase()}</Link>
                </h3>

                <div className="sg-card-price-row">
                    <span className="sg-card-price">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice > 0 && (
                        <span className="sg-card-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                </div>

                {showAdminActions ? (
                    <div className="sg-admin-actions">
                        <button className="btn btn-edit" onClick={() => onEdit(product)}>✏️ Edit</button>
                        <button className="btn btn-delete" onClick={() => onDelete(product)}>🗑️ Delete</button>
                    </div>
                ) : (
                    <button
                        className="sg-card-btn"
                        onClick={handleAdd}
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                    </button>
                )}
            </div>
        </article>
    );
}
