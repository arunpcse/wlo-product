import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

function HeroCarousel() {
    const { slides } = useSettings();
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    // Reset current if slides length changes
    useEffect(() => {
        if (current >= slides.length) setCurrent(0);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const t = setInterval(() => {
            setAnimating(true);
            setTimeout(() => { setCurrent((c) => (c + 1) % slides.length); setAnimating(false); }, 300);
        }, 5000);
        return () => clearInterval(t);
    }, [slides.length]);

    const goTo = (i) => { setAnimating(true); setTimeout(() => { setCurrent(i); setAnimating(false); }, 200); };
    const s = slides[current] || slides[0];
    if (!s) return null;

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
                {slides.map((_, i) => (
                    <button key={i} className={`hero-v2-dot ${i === current ? 'active' : ''}`}
                        style={i === current ? { background: s.accent } : {}}
                        onClick={() => goTo(i)} />
                ))}
            </div>
            <div className="hero-v2-slide-counter">{current + 1} / {slides.length}</div>
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
