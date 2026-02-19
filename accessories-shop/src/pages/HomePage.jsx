import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

/* ── Hero Slides ──────────────────────────────────────────── */
const SLIDES = [
    {
        badge: 'MEGA DEALS',
        title: 'Best Deals on\nPremium Accessories',
        subtitle: 'Up to 40% OFF on top-rated mobile accessories. Limited time offer!',
        cta: 'Shop Deals',
        link: '/shop',
        gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        accent: '#FF6B00',
        img: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&w=480&q=80',
    },
    {
        badge: '9H HARDNESS',
        title: 'Premium Screen\nProtection Glass',
        subtitle: 'Military-grade tempered glass. Anti-scratch, anti-fingerprint. Starting ₹199.',
        cta: 'View Collection',
        link: '/shop?category=Screen+Protection',
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        accent: '#00D2FF',
        img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&w=480&q=80',
    },
    {
        badge: 'FAST CHARGING',
        title: 'Built to Last\nCharging Cables',
        subtitle: 'Type-C, Lightning & USB-A cables with ultra-durable braided design.',
        cta: 'Explore Now',
        link: '/shop?category=Cables+%26+Chargers',
        gradient: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #2d1b00 100%)',
        accent: '#FFD700',
        img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&w=480&q=80',
    },
];

const CATEGORIES = [
    { name: 'Screen Protection', img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&w=300&q=75', count: 'Tempered Glass' },
    { name: 'Cables & Chargers', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&w=300&q=75', count: 'Fast Charging' },
    { name: 'Audio', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&w=300&q=75', count: 'Earphones & More' },
    { name: 'Phone Cases', img: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?auto=format&w=300&q=75', count: 'All Models' },
    { name: 'Car Accessories', img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&w=300&q=75', count: 'Mounts & More' },
    { name: 'Powerbanks', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&w=300&q=75', count: '10000mAh+' },
];

function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const t = setInterval(() => {
            setAnimating(true);
            setTimeout(() => { setCurrent((c) => (c + 1) % SLIDES.length); setAnimating(false); }, 300);
        }, 5000);
        return () => clearInterval(t);
    }, []);

    const goTo = (i) => { setAnimating(true); setTimeout(() => { setCurrent(i); setAnimating(false); }, 200); };
    const s = SLIDES[current];

    return (
        <section className="hero-v2" style={{ background: s.gradient }}>
            <div className={`hero-v2-inner ${animating ? 'fade-out' : 'fade-in'}`}>
                <div className="hero-v2-left">
                    <span className="hero-badge" style={{ color: s.accent, borderColor: s.accent }}>
                        ✦ {s.badge}
                    </span>
                    <h1 className="hero-v2-title" style={{ '--hero-accent': s.accent }}>
                        {s.title.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                    </h1>
                    <p className="hero-v2-sub">{s.subtitle}</p>
                    <div className="hero-v2-actions">
                        <Link to={s.link} className="hero-v2-btn" style={{ background: s.accent, boxShadow: `0 8px 28px ${s.accent}55` }}>
                            {s.cta} →
                        </Link>
                        <Link to="/shop" className="hero-v2-btn-ghost">Browse All</Link>
                    </div>
                </div>
                <div className="hero-v2-right">
                    <div className="hero-v2-img-wrap">
                        <img
                            src={s.img}
                            alt={s.badge}
                            className="hero-v2-product-img"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="hero-v2-glow" style={{ background: s.accent }} />
                    </div>
                </div>
            </div>
            <div className="hero-v2-dots">
                {SLIDES.map((_, i) => (
                    <button key={i} className={`hero-v2-dot ${i === current ? 'active' : ''}`}
                        style={i === current ? { background: s.accent } : {}}
                        onClick={() => goTo(i)} />
                ))}
            </div>
            <div className="hero-v2-slide-counter">{current + 1} / {SLIDES.length}</div>
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
                {CATEGORIES.map(({ name, img, count }) => (
                    <Link key={name} to={`/shop?category=${encodeURIComponent(name)}`} className="category-v2-card">
                        <div className="category-v2-img-wrap">
                            <img src={img} alt={name} className="category-v2-img" loading="lazy" />
                            <div className="category-v2-overlay" />
                        </div>
                        <div className="category-v2-name">{name}</div>
                        <div className="category-v2-sub">{count}</div>
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
