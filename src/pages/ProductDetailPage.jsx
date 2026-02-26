import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

function Stars({ rating, size = 16 }) {
    return (
        <span style={{ fontSize: size }}>
            {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ color: i < Math.round(rating) ? '#FF6B00' : '#D1D5DB' }}>★</span>
            ))}
        </span>
    );
}

function DeliveryDate() {
    const d = new Date();
    d.setDate(d.getDate() + Math.floor(Math.random() * 2) + 3);
    return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToast } = useToast();
    const { products } = useProducts();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [qty, setQty] = useState(1);
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setLoading(true);
        productAPI.getById(id)
            .then((res) => setProduct(res.data.data))
            .catch(() => navigate('/shop'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    if (loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!product) return null;

    const allImages = [product.image, ...(product.images || [])].filter(Boolean);
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    const related = products.filter((p) => p.category === product.category && p._id !== product._id).slice(0, 6);
    const inWish = isInWishlist(product._id);

    const handleAddToCart = () => {
        for (let i = 0; i < qty; i++) addToCart(product);
        addToast(`${qty}× "${product.name}" added to cart 🛒`, 'success');
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };

    const handleShare = () => {
        navigator.clipboard?.writeText(window.location.href);
        const text = `Check out ${product.name} on World Line On!\n${window.location.href}`;
        if (navigator.share) navigator.share({ title: product.name, url: window.location.href });
        else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        addToast('Link copied! 🔗', 'success');
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!reviewName || !reviewText) return;
        setSubmitting(true);
        try {
            await productAPI.addReview(id, { name: reviewName, rating: reviewRating, comment: reviewText });
            addToast('Review submitted! Thank you 🙏', 'success');
            setReviewName(''); setReviewText(''); setReviewRating(5);
            // Refresh product
            const res = await productAPI.getById(id);
            setProduct(res.data.data);
        } catch {
            addToast('Could not submit review. Try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const stockLabel = product.stock === 0 ? '🔴 Out of Stock'
        : product.stock <= 5 ? `🟡 Only ${product.stock} left!`
            : '🟢 In Stock';

    return (
        <main className="product-detail-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link to="/">Home</Link> / <Link to="/shop">{product.category}</Link> / <span>{product.name}</span>
            </nav>

            <div className="product-detail-grid">
                {/* ── Image Gallery ──────────────────────────────────── */}
                <div className="product-gallery">
                    <div className="gallery-main-wrap">
                        <img
                            src={allImages[activeImg] || 'https://via.placeholder.com/500x500?text=No+Image'}
                            alt={product.name}
                            className="gallery-main-img"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500?text=No+Image'; }}
                        />
                        {discount > 0 && <span className="gallery-discount-badge">{discount}% OFF</span>}
                    </div>
                    {allImages.length > 1 && (
                        <div className="gallery-thumbs">
                            {allImages.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`View ${i + 1}`}
                                    className={`gallery-thumb ${i === activeImg ? 'active' : ''}`}
                                    onClick={() => setActiveImg(i)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Product Info ────────────────────────────────────── */}
                <div className="product-detail-info">
                    <h1 className="detail-product-name">{product.name}</h1>

                    {/* Rating */}
                    <div className="detail-rating-row">
                        <Stars rating={product.rating || 4} size={18} />
                        <span className="detail-rating-val">{product.rating || 4.0}</span>
                        <span className="detail-review-count">({product.reviewCount || 0} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="detail-price-block">
                        <span className="detail-price">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.originalPrice && (
                            <>
                                <span className="detail-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                <span className="detail-discount-percent">{discount}% off</span>
                            </>
                        )}
                    </div>

                    {/* Stock */}
                    <p className="detail-stock">{stockLabel}</p>

                    {/* Qty + Actions */}
                    {product.stock > 0 && (
                        <>
                            <div className="detail-qty-row">
                                <span>Qty:</span>
                                <div className="qty-selector">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                                    <span>{qty}</span>
                                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
                                </div>
                            </div>
                            <div className="detail-btn-row">
                                <button className="btn-add-cart" onClick={handleAddToCart}>🛒 Add to Cart</button>
                                <button className="btn-buy-now" onClick={handleBuyNow}>⚡ Buy Now</button>
                            </div>
                        </>
                    )}

                    <div className="detail-actions-row">
                        <button className={`btn-wishlist ${inWish ? 'active' : ''}`} onClick={() => toggleWishlist(product)}>
                            {inWish ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}
                        </button>
                        <button className="btn-share" onClick={handleShare}>🔗 Share</button>
                    </div>

                    {/* Delivery & Policy */}
                    <div className="detail-delivery-card">
                        <div className="delivery-row"><span>🚚</span> <span>Estimated delivery: <strong><DeliveryDate /></strong></span></div>
                        <div className="delivery-row"><span>↩️</span> <span>7-day return policy</span></div>
                        <div className="delivery-row"><span>✅</span> <span>100% Genuine products</span></div>
                        <div className="delivery-row"><span>💬</span> <span>WhatsApp support: +91 93610 46703</span></div>
                    </div>
                </div>
            </div>

            {/* ── Description + Specs ──────────────────────────────── */}
            <section className="detail-description-section">
                <h2>Product Description</h2>
                <p>{product.description}</p>
            </section>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
                <section className="detail-specs-section">
                    <h2>Specifications</h2>
                    <table className="specs-table">
                        <tbody>
                            {Object.entries(product.specifications).map(([k, v]) => (
                                <tr key={k}>
                                    <td className="spec-key">{k}</td>
                                    <td className="spec-val">{v}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* ── Reviews ──────────────────────────────────────────── */}
            <section className="detail-reviews-section">
                <h2>Customer Reviews ({product.reviewCount || 0})</h2>
                {(product.reviews || []).length === 0 && (
                    <p className="no-reviews">No reviews yet. Be the first to review!</p>
                )}
                <div className="reviews-list">
                    {(product.reviews || []).map((r, i) => (
                        <div key={i} className="review-card">
                            <div className="review-header">
                                <strong>{r.name}</strong>
                                <Stars rating={r.rating} size={14} />
                                <span className="review-date">{new Date(r.date).toLocaleDateString('en-IN')}</span>
                            </div>
                            <p className="review-comment">{r.comment}</p>
                        </div>
                    ))}
                </div>

                {/* Write a review */}
                <div className="write-review">
                    <h3>Write a Review</h3>
                    <form onSubmit={submitReview} className="review-form">
                        <input
                            placeholder="Your name"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            required
                        />
                        <div className="star-input">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <span
                                    key={s}
                                    onClick={() => setReviewRating(s)}
                                    style={{ fontSize: 28, cursor: 'pointer', color: s <= reviewRating ? '#FF6B00' : '#ccc' }}
                                >★</span>
                            ))}
                        </div>
                        <textarea
                            placeholder="Share your experience..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={3}
                            required
                        />
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting…' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            </section>

            {/* ── Related Products ──────────────────────────────────── */}
            {related.length > 0 && (
                <section className="detail-related-section">
                    <h2>Related Products</h2>
                    <div className="products-grid">
                        {related.map((p) => <ProductCard key={p._id} product={p} />)}
                    </div>
                </section>
            )}
        </main>
    );
}
