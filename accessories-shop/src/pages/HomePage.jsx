import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

// ── Hero slides ──────────────────────────────────────────────────────────────
const SLIDES = [
    {
        title: '🔥 Best Deals on Accessories',
        subtitle: 'Up to 40% OFF on premium mobile accessories',
        cta: 'Shop Now',
        bg: 'linear-gradient(135deg, #FF6B00 0%, #FF8C38 50%, #FFB347 100%)',
        link: '/shop',
    },
    {
        title: '📱 Premium Screen Protection',
        subtitle: '9H hardness tempered glass starting at ₹199',
        cta: 'View Collection',
        bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        link: '/shop',
    },
    {
        title: '⚡ Fast Charging Solutions',
        subtitle: 'Type-C, Lightning & USB cables — built to last',
        cta: 'Explore Now',
        bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        link: '/shop',
    },
];

const CATEGORY_ICONS = [
    { name: 'Screen Protection', icon: '🛡️', color: '#e8f4fd' },
    { name: 'Cables & Chargers', icon: '⚡', color: '#fff3e0' },
    { name: 'Audio', icon: '🎧', color: '#f3e5f5' },
    { name: 'Phone Cases', icon: '📱', color: '#e8f5e9' },
    { name: 'Car Accessories', icon: '🚗', color: '#fce4ec' },
    { name: 'Powerbanks', icon: '🔋', color: '#e0f2f1' },
];

function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 4000);
        return () => clearInterval(timer);
    }, []);

    const slide = SLIDES[current];
    return (
        <section
            className="hero-carousel"
            style={{ background: slide.bg, transition: 'background 0.8s ease' }}
            aria-label="Promotional banner"
        >
            <div className="hero-carousel-content">
                <h1 className="hero-carousel-title">{slide.title}</h1>
                <p className="hero-carousel-subtitle">{slide.subtitle}</p>
                <Link to={slide.link} className="hero-carousel-btn">{slide.cta} →</Link>
            </div>
            <div className="hero-carousel-dots">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        className={`carousel-dot ${i === current ? 'active' : ''}`}
                        onClick={() => setCurrent(i)}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

function CategoryGrid({ categories }) {
    return (
        <section className="category-grid-section">
            <h2 className="section-heading">Shop by Category</h2>
            <div className="category-grid">
                {CATEGORY_ICONS.map(({ name, icon, color }) => (
                    <Link
                        key={name}
                        to={`/shop?category=${encodeURIComponent(name)}`}
                        className="category-card"
                        style={{ background: color }}
                    >
                        <span className="category-card-icon">{icon}</span>
                        <span className="category-card-name">{name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function ProductRow({ title, products, badge }) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToast } = useToast();

    if (!products.length) return null;
    return (
        <section className="product-row-section">
            <div className="section-header-row">
                <h2 className="section-heading">{title}</h2>
                <Link to="/shop" className="see-all-link">See all →</Link>
            </div>
            <div className="product-row-scroll">
                {products.slice(0, 8).map((p) => (
                    <div key={p._id} className="product-row-item">
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </section>
    );
}

function PromoBar() {
    return (
        <section className="promo-bar">
            {[
                { icon: '🚚', title: 'Free Delivery', sub: 'On orders above ₹499' },
                { icon: '↩️', title: 'Easy Returns', sub: '7-day return policy' },
                { icon: '✅', title: '100% Genuine', sub: 'Authentic products only' },
                { icon: '💬', title: '24/7 Support', sub: 'WhatsApp support' },
            ].map(({ icon, title, sub }) => (
                <div key={title} className="promo-bar-item">
                    <span className="promo-bar-icon">{icon}</span>
                    <div>
                        <div className="promo-bar-title">{title}</div>
                        <div className="promo-bar-sub">{sub}</div>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default function HomePage() {
    const { products, categories, loading } = useProducts();

    const featured = products.filter((p) => p.isFeatured);
    const newArrivals = products.filter((p) => p.isNewArrival);
    const bestSellers = products.filter((p) => p.isBestSeller);

    // Fallback if no tagged products yet — show all products
    const featuredShow = featured.length ? featured : products.slice(0, 8);
    const newShow = newArrivals.length ? newArrivals : products.slice(0, 8);
    const bestShow = bestSellers.length ? bestSellers : products.slice(0, 8);

    if (loading) return <LoadingSpinner text="Loading store…" />;

    return (
        <main className="home-page">
            <HeroCarousel />
            <PromoBar />
            <CategoryGrid categories={categories} />

            {featuredShow.length > 0 && (
                <ProductRow title="⭐ Featured Products" products={featuredShow} />
            )}
            {newShow.length > 0 && (
                <ProductRow title="🆕 New Arrivals" products={newShow} />
            )}
            {bestShow.length > 0 && (
                <ProductRow title="🔥 Best Sellers" products={bestShow} />
            )}

            {products.length === 0 && (
                <div className="empty-store">
                    <p>🏪</p>
                    <h2>Store coming soon!</h2>
                    <p>Check back later for amazing deals.</p>
                </div>
            )}
        </main>
    );
}
