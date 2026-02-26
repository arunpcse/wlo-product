import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

// Fallback full-screen background slides (Native Union style)
const BG_SLIDES = [
    {
        bg: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1600&q=90&fit=crop',
        badge: 'PREMIUM AUDIO',
        title: 'Sound Without\nBoundaries',
        subtitle: 'Premium wireless earbuds & headphones for every lifestyle.',
        cta: 'Shop Now',
        link: '/shop?category=Earbuds',
    },
    {
        bg: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=1600&q=90&fit=crop',
        badge: 'PHONE PROTECTION',
        title: 'Protect What\nMatters Most',
        subtitle: 'Stylish, tough phone cases & screen protectors for every model.',
        cta: 'Shop Cases',
        link: '/shop?category=Cases',
    },
    {
        bg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=90&fit=crop',
        badge: 'FAST CHARGING',
        title: 'Power Up\nIn Minutes',
        subtitle: 'Ultra-fast chargers, power banks & cables. Always stay powered.',
        cta: 'Shop Chargers',
        link: '/shop?category=Chargers',
    },
];

function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const t = setInterval(() => {
            setFading(true);
            setTimeout(() => { setCurrent((c) => (c + 1) % BG_SLIDES.length); setFading(false); }, 400);
        }, 5500);
        return () => clearInterval(t);
    }, []);

    const goTo = (i) => {
        setFading(true);
        setTimeout(() => { setCurrent(i); setFading(false); }, 300);
    };

    const s = BG_SLIDES[current];

    return (
        <section className="hero-fullbg">
            {/* Background images (pre-loaded all, crossfade active) */}
            {BG_SLIDES.map((slide, i) => (
                <div
                    key={i}
                    className="hero-fullbg-bg"
                    style={{
                        backgroundImage: `url(${slide.bg})`,
                        opacity: i === current ? 1 : 0,
                        transition: 'opacity 0.7s ease',
                    }}
                />
            ))}

            {/* Overlay */}
            <div className="hero-fullbg-overlay" />

            {/* Content */}
            <div className={`hero-fullbg-content ${fading ? 'fading' : ''}`}>
                <span className="hero-fullbg-badge">{s.badge}</span>
                <h1 className="hero-fullbg-title">
                    {s.title.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                </h1>
                <p className="hero-fullbg-sub">{s.subtitle}</p>
                <div className="hero-fullbg-actions">
                    <Link to={s.link} className="hero-fullbg-btn">
                        {s.cta} →
                    </Link>
                    <Link to="/shop" className="hero-fullbg-btn-ghost">Browse All</Link>
                </div>
            </div>

            {/* Dots */}
            <div className="hero-fullbg-dots">
                {BG_SLIDES.map((_, i) => (
                    <button
                        key={i}
                        className={`hero-fullbg-dot ${i === current ? 'active' : ''}`}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>

            <div className="hero-fullbg-counter">{current + 1} / {BG_SLIDES.length}</div>
        </section>
    );
}

function PromoStrip() {
    const items = [
        { icon: '🚀', title: 'Fast Delivery', sub: 'Orders above ₹499 ship free' },
        { icon: '🔄', title: 'Easy Returns', sub: '7-day hassle-free returns' },
        { icon: '🔒', title: '100% Authentic', sub: 'Only genuine branded products' },
        { icon: '💬', title: 'WhatsApp Support', sub: 'Chat with us anytime' },
    ];
    return (
        <section className="promo-strip">
            <div className="promo-strip-inner">
                {items.map(({ icon, title, sub }) => (
                    <div key={title} className="promo-strip-card">
                        <div className="promo-strip-icon">{icon}</div>
                        <div className="promo-strip-text">
                            <div className="promo-strip-title">{title}</div>
                            <div className="promo-strip-sub">{sub}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function CategorySection() {
    const { categoryImages } = useSettings();
    return (
        <section className="home-section">
            <div className="home-section-header">
                <div>
                    <h2 className="home-section-title">Shop by Category</h2>
                    <p className="home-section-sub">Find exactly what you need</p>
                </div>
                <Link to="/shop" className="home-see-all">View all →</Link>
            </div>
            <div className="category-v2-grid">
                {categoryImages.map(({ name, img, sub }) => (
                    <Link key={name} to={`/shop?category=${encodeURIComponent(name)}`} className="category-v2-card">
                        <div className="category-v2-img-wrap">
                            <img src={img} alt={name} className="category-v2-img" loading="lazy" />
                            <div className="category-v2-overlay" />
                        </div>
                        <div className="category-v2-name">{name}</div>
                        <div className="category-v2-sub">{sub}</div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function ProductSection({ title, subtitle, products }) {
    if (!products.length) return null;
    return (
        <section className="home-section">
            <div className="home-section-header">
                <div>
                    <h2 className="home-section-title">{title}</h2>
                    {subtitle && <p className="home-section-sub">{subtitle}</p>}
                </div>
                <Link to="/shop" className="home-see-all">View all →</Link>
            </div>
            <div className="home-product-scroll">
                {products.slice(0, 8).map((p) => (
                    <div key={p._id} className="home-product-item">
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </section>
    );
}

function BannerMid() {
    return (
        <section className="mid-banner">
            <div className="mid-banner-content">
                <div className="mid-banner-tag">LIMITED TIME OFFER</div>
                <h2>Combo Deals — Save More!</h2>
                <p>Buy 2+ accessories and get extra 10% off. Use code <strong>WLO10</strong> at checkout.</p>
                <Link to="/shop" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>Shop Combos →</Link>
            </div>
            <div className="mid-banner-emoji">🎁</div>
        </section>
    );
}

export default function HomePage() {
    const { products, loading } = useProducts();

    const featured = products.filter((p) => p.isFeatured);
    const newArr = products.filter((p) => p.isNewArrival);
    const bestSell = products.filter((p) => p.isBestSeller);
    const allShow = products.slice(0, 8);

    const featuredShow = featured.length ? featured : allShow;
    const newShow = newArr.length ? newArr : allShow;
    const bestShow = bestSell.length ? bestSell : allShow;

    if (loading) return <LoadingSpinner text="Loading store…" />;

    return (
        <main className="home-page">
            <HeroCarousel />
            <PromoStrip />
            <div className="home-content">
                <CategorySection />
                {featuredShow.length > 0 && (
                    <ProductSection title="⭐ Featured Products" subtitle="Handpicked best-selling items" products={featuredShow} />
                )}
                <BannerMid />
                {newShow.length > 0 && (
                    <ProductSection title="🆕 New Arrivals" subtitle="Fresh additions to our collection" products={newShow} />
                )}
                {bestShow.length > 0 && (
                    <ProductSection title="🔥 Best Sellers" subtitle="Most loved by our customers" products={bestShow} />
                )}
            </div>
        </main>
    );
}
