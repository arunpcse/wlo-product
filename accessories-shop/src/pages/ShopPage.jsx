import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const SORT_OPTIONS = [
    { value: 'newest', label: '🆕 Newest' },
    { value: 'price_asc', label: '💰 Price: Low to High' },
    { value: 'price_desc', label: '💰 Price: High to Low' },
    { value: 'rating', label: '⭐ Top Rated' },
    { value: 'popular', label: '🔥 Popularity' },
];

const RATING_FILTERS = [
    { value: 0, label: 'Any Rating' },
    { value: 3, label: '3★ & above' },
    { value: 4, label: '4★ & above' },
    { value: 4.5, label: '4.5★ & above' },
];

function Stars({ rating }) {
    return (
        <span>
            {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ color: i < Math.round(rating) ? '#FF6B00' : '#D1D5DB', fontSize: 14 }}>★</span>
            ))}
        </span>
    );
}

function ProductBadges({ product }) {
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    return (
        <div className="product-badges">
            {discount >= 5 && <span className="badge badge-sale">{discount}% OFF</span>}
            {product.isNewArrival && <span className="badge badge-new">NEW</span>}
            {product.isBestSeller && <span className="badge badge-best">BEST SELLER</span>}
            {product.isFeatured && <span className="badge badge-featured">FEATURED</span>}
            {product.stock > 0 && product.stock <= 5 && <span className="badge badge-limited">LIMITED</span>}
        </div>
    );
}

const ITEMS_PER_PAGE = 12;

export default function ShopPage() {
    const { products, categories, loading } = useProducts();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { addToast } = useToast();

    const [search, setSearch] = useState('');
    const [activeCategory, setCat] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [minRating, setMinRating] = useState(0);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [page, setPage] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const filtered = useMemo(() => {
        let list = products.filter((p) => {
            if (p.isActive === false) return false;
            if (activeCategory !== 'All' && p.category !== activeCategory) return false;
            if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
                !p.description?.toLowerCase().includes(search.toLowerCase())) return false;
            if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
            if ((p.rating || 4) < minRating) return false;
            return true;
        });

        switch (sortBy) {
            case 'price_asc': list = [...list].sort((a, b) => a.price - b.price); break;
            case 'price_desc': list = [...list].sort((a, b) => b.price - a.price); break;
            case 'rating': list = [...list].sort((a, b) => (b.rating || 4) - (a.rating || 4)); break;
            case 'popular': list = [...list].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)); break;
            default: list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return list;
    }, [products, activeCategory, search, sortBy, minRating, priceRange]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const resetFilters = () => {
        setCat('All'); setSortBy('newest'); setMinRating(0); setPriceRange([0, 10000]); setSearch(''); setPage(1);
    };

    if (loading) return <LoadingSpinner text="Loading products…" />;

    const handleAddToCart = (product) => {
        if (product.stock === 0) return;
        addToCart(product);
        addToast(`"${product.name}" added to cart 🛒`, 'success');
    };

    return (
        <main className="shop-page">
            {/* ── Top bar ───────────────────────────── */}
            <div className="shop-topbar">
                <div className="shop-search-box">
                    <span>🔍</span>
                    <input
                        type="search"
                        placeholder="Search products…"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="search-input"
                    />
                    {search && <button onClick={() => setSearch('')} className="search-clear">✕</button>}
                </div>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="view-toggle">
                    <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>⊞</button>
                    <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>☰</button>
                </div>
                <button className="filter-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    ⚙️ Filters
                </button>
            </div>

            <div className="shop-layout">
                {/* ── Sidebar ───────────────────────── */}
                <aside className={`shop-sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <h3>Filters</h3>
                        <button onClick={resetFilters} className="reset-filters-btn">Reset all</button>
                    </div>

                    {/* Category */}
                    <div className="filter-group">
                        <h4>Category</h4>
                        {['All', ...categories].map((cat) => (
                            <label key={cat} className="filter-radio">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={activeCategory === cat}
                                    onChange={() => { setCat(cat); setPage(1); }}
                                />
                                {cat}
                            </label>
                        ))}
                    </div>

                    {/* Price range */}
                    <div className="filter-group">
                        <h4>Price Range</h4>
                        <div className="price-range-labels">
                            <span>₹{priceRange[0]}</span> <span>₹{priceRange[1]}</span>
                        </div>
                        <input
                            type="range" min={0} max={10000} step={50}
                            value={priceRange[1]}
                            onChange={(e) => { setPriceRange([priceRange[0], +e.target.value]); setPage(1); }}
                            className="price-slider"
                        />
                    </div>

                    {/* Rating */}
                    <div className="filter-group">
                        <h4>Minimum Rating</h4>
                        {RATING_FILTERS.map((r) => (
                            <label key={r.value} className="filter-radio">
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={minRating === r.value}
                                    onChange={() => { setMinRating(r.value); setPage(1); }}
                                />
                                {r.label}
                            </label>
                        ))}
                    </div>

                    {sidebarOpen && (
                        <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}>✕ Close</button>
                    )}
                </aside>

                {/* ── Products ──────────────────────── */}
                <div className="shop-main">
                    {/* Category pills */}
                    <div className="category-tabs">
                        {['All', ...categories].map((cat) => (
                            <button
                                key={cat}
                                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => { setCat(cat); setPage(1); }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="shop-results-bar">
                        <span className="results-count">{filtered.length} products</span>
                    </div>

                    {paginated.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <h3>No products found</h3>
                            <button onClick={resetFilters} className="btn btn-primary">Clear Filters</button>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? 'products-grid' : 'products-list'}>
                            {paginated.map((product) => {
                                const discount = product.originalPrice
                                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                                    : 0;
                                const inWish = isInWishlist(product._id);
                                return (
                                    <article key={product._id} className={`product-card ${viewMode === 'list' ? 'list-card' : ''}`}>
                                        <div className="product-image-wrapper">
                                            <Link to={`/product/${product._id}`}>
                                                <img
                                                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                                    alt={product.name}
                                                    className="product-image"
                                                    loading="lazy"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                                />
                                            </Link>
                                            <ProductBadges product={product} />
                                            <button
                                                className={`wishlist-btn ${inWish ? 'active' : ''}`}
                                                onClick={() => toggleWishlist(product)}
                                                aria-label="Toggle wishlist"
                                            >{inWish ? '❤️' : '🤍'}</button>
                                            {product.stock === 0 && <div className="out-of-stock-badge">Out of Stock</div>}
                                        </div>
                                        <div className="product-info">
                                            <span className="product-category-label">{product.category}</span>
                                            <h3 className="product-name">
                                                <Link to={`/product/${product._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    {product.name}
                                                </Link>
                                            </h3>
                                            <p className="product-description">{product.description}</p>
                                            <div className="product-rating">
                                                <Stars rating={product.rating || 4} />
                                                <span className="rating-value">({product.rating || 4.0})</span>
                                                {product.reviewCount > 0 && <span className="review-count">{product.reviewCount} reviews</span>}
                                            </div>
                                            <div className="product-footer">
                                                <div>
                                                    <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                                                    {discount > 0 && (
                                                        <>
                                                            <span className="product-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                                            <span className="discount-text">{discount}% off</span>
                                                        </>
                                                    )}
                                                </div>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={product.stock === 0}
                                                >
                                                    {product.stock === 0 ? 'Out of Stock' : '+ Add'}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Pagination ──────────────────── */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                            ))}
                            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
