import { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ShopPage() {
    const { products, categories, loading } = useProducts();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const matchCat = activeCategory === 'All' || p.category === activeCategory;
            const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch && p.isActive !== false;
        });
    }, [products, activeCategory, search]);

    if (loading) return <LoadingSpinner text="Loading products..." />;

    return (
        <main className="page">
            {/* Hero */}
            <section className="hero" aria-label="Shop hero">
                <div className="hero-content">
                    <h1 className="hero-title">📱 World Line Out</h1>
                    <p className="hero-subtitle">Premium Mobile Accessories for Every Device</p>
                    <div className="hero-stats">
                        <div className="stat"><span className="stat-number">{products.length}+</span><span className="stat-label">Products</span></div>
                        <div className="stat-divider" />
                        <div className="stat"><span className="stat-number">100%</span><span className="stat-label">Genuine</span></div>
                        <div className="stat-divider" />
                        <div className="stat"><span className="stat-number">Fast</span><span className="stat-label">Delivery</span></div>
                    </div>
                </div>
            </section>

            {/* Search & Filters */}
            <section className="filters-section">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input type="search" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" aria-label="Search" />
                    {search && <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>}
                </div>
                <div className="category-tabs" role="tablist">
                    {['All', ...categories].map((cat) => (
                        <button key={cat} role="tab" aria-selected={activeCategory === cat} className={`category-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Grid */}
            <section className="products-section">
                <div className="section-header">
                    <h2 className="section-title">{activeCategory === 'All' ? 'All Products' : activeCategory}</h2>
                    <span className="results-count">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
                </div>
                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No products found</h3>
                        <p>Try a different search or category</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
                    </div>
                )}
            </section>
        </main>
    );
}
