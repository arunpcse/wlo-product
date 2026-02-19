import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { orderAPI } from '../utils/api';
import ProductForm from '../components/ProductForm';
import DeleteConfirm from '../components/DeleteConfirm';

const CAT_IMAGES = {
    'Screen Protection': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&w=420&q=80',
    'Cables & Chargers': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&w=420&q=80',
    'Audio': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&w=420&q=80',
    'Phone Cases': 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?auto=format&w=420&q=80',
    'Car Accessories': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&w=420&q=80',
    'Powerbanks': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&w=420&q=80',
    'Power Banks': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&w=420&q=80',
    'default': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&w=420&q=80',
};
function imgFallback(e, category) {
    e.target.src = CAT_IMAGES[category] || CAT_IMAGES.default;
    e.target.onerror = null;
}

const STATUS_COLORS = {
    pending: { bg: '#fff7ed', color: '#ea580c', dot: '#f97316' },
    confirmed: { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
    shipped: { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
    delivered: { bg: '#f5f3ff', color: '#7c3aed', dot: '#8b5cf6' },
    cancelled: { bg: '#fff1f2', color: '#dc2626', dot: '#ef4444' },
};

export default function AdminPage() {
    const { products, addProduct, updateProduct, deleteProduct, useLocalFallback } = useProducts();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('Products');
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [orders, setOrders] = useState([]);
    const [ordersLoaded, setOrdersLoaded] = useState(false);
    const [orderFilter, setOrderFilter] = useState('all');
    const [productSearch, setProductSearch] = useState('');

    const loadOrders = async () => {
        if (ordersLoaded) return;
        try {
            const res = await orderAPI.getAll();
            setOrders(res.data.data);
            setOrdersLoaded(true);
        } catch {
            addToast('Could not load orders (backend offline)', 'warning');
            setOrdersLoaded(true);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'Orders') loadOrders();
    };

    const handleSave = async (formData) => {
        try {
            if (editProduct) {
                await updateProduct(editProduct._id, formData);
                addToast('Product updated!', 'success');
            } else {
                await addProduct(formData);
                addToast('Product added!', 'success');
            }
            setShowForm(false);
            setEditProduct(null);
        } catch {
            addToast('Error saving product', 'error');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteProduct(deleteTarget._id);
            addToast('Product deleted', 'info');
        } catch {
            addToast('Error deleting product', 'error');
        }
        setDeleteTarget(null);
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            await orderAPI.updateStatus(orderId, status);
            setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
            addToast('Order status updated', 'success');
        } catch {
            addToast('Could not update status', 'error');
        }
    };

    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const inStock = products.filter(p => p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    const filteredProducts = products.filter(p =>
        !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category?.toLowerCase().includes(productSearch.toLowerCase())
    );
    const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);

    return (
        <div className="admin-layout">
            {/* ── Sidebar ── */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-logo">
                    <div className="admin-sidebar-icon">⚙️</div>
                    <div>
                        <div className="admin-sidebar-brand">Admin Panel</div>
                        <div className="admin-sidebar-sub">World Line On</div>
                    </div>
                </div>
                <nav className="admin-nav">
                    {[
                        { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
                        { id: 'Products', icon: '📦', label: 'Products' },
                        { id: 'Orders', icon: '🛒', label: 'Orders' },
                    ].map(({ id, icon, label }) => (
                        <button
                            key={id}
                            className={`admin-nav-item ${activeTab === id ? 'active' : ''}`}
                            onClick={() => handleTabChange(id)}
                        >
                            <span className="admin-nav-icon">{icon}</span>
                            <span>{label}</span>
                            {id === 'Orders' && pendingOrders > 0 && (
                                <span className="admin-nav-badge">{pendingOrders}</span>
                            )}
                        </button>
                    ))}
                </nav>
                {useLocalFallback && (
                    <div className="admin-offline-pill">⚠️ Offline Mode</div>
                )}
            </aside>

            {/* ── Main content ── */}
            <div className="admin-main">
                {/* ── Dashboard tab ── */}
                {activeTab === 'Dashboard' && (
                    <div className="admin-section">
                        <div className="admin-section-header">
                            <h1 className="admin-page-title">Dashboard</h1>
                            <p className="admin-page-sub">Welcome back! Here's what's happening today.</p>
                        </div>
                        <div className="admin-kpi-grid">
                            <div className="admin-kpi-card admin-kpi-orange">
                                <div className="admin-kpi-icon">📦</div>
                                <div className="admin-kpi-value">{products.length}</div>
                                <div className="admin-kpi-label">Total Products</div>
                            </div>
                            <div className="admin-kpi-card admin-kpi-green">
                                <div className="admin-kpi-icon">✅</div>
                                <div className="admin-kpi-value">{inStock}</div>
                                <div className="admin-kpi-label">In Stock</div>
                            </div>
                            <div className="admin-kpi-card admin-kpi-red">
                                <div className="admin-kpi-icon">⚠️</div>
                                <div className="admin-kpi-value">{outOfStock}</div>
                                <div className="admin-kpi-label">Out of Stock</div>
                            </div>
                            <div className="admin-kpi-card admin-kpi-purple">
                                <div className="admin-kpi-icon">🛒</div>
                                <div className="admin-kpi-value">{orders.length}</div>
                                <div className="admin-kpi-label">Total Orders</div>
                            </div>
                            <div className="admin-kpi-card admin-kpi-blue">
                                <div className="admin-kpi-icon">💰</div>
                                <div className="admin-kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
                                <div className="admin-kpi-label">Revenue</div>
                            </div>
                            <div className="admin-kpi-card admin-kpi-amber">
                                <div className="admin-kpi-icon">⏳</div>
                                <div className="admin-kpi-value">{pendingOrders}</div>
                                <div className="admin-kpi-label">Pending Orders</div>
                            </div>
                        </div>
                        <div className="admin-quick-actions">
                            <h3 className="admin-sub-title">Quick Actions</h3>
                            <div className="admin-quick-row">
                                <button className="admin-quick-btn" onClick={() => { setEditProduct(null); setShowForm(true); }}>
                                    <span>➕</span> Add New Product
                                </button>
                                <button className="admin-quick-btn" onClick={() => handleTabChange('Orders')}>
                                    <span>📋</span> View All Orders
                                </button>
                                <button className="admin-quick-btn" onClick={() => handleTabChange('Products')}>
                                    <span>📦</span> Manage Products
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Products tab ── */}
                {activeTab === 'Products' && (
                    <div className="admin-section">
                        <div className="admin-section-header">
                            <div>
                                <h1 className="admin-page-title">Products</h1>
                                <p className="admin-page-sub">{products.length} total products</p>
                            </div>
                            <button className="admin-primary-btn" onClick={() => { setEditProduct(null); setShowForm(true); }}>
                                ➕ Add Product
                            </button>
                        </div>

                        {/* Search */}
                        <div className="admin-search-wrap">
                            <span className="admin-search-icon">🔍</span>
                            <input
                                type="search"
                                className="admin-search-input"
                                placeholder="Search products by name or category…"
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                            />
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="admin-empty">
                                <div className="admin-empty-icon">📦</div>
                                <h3>No products found</h3>
                                <button className="admin-primary-btn" onClick={() => setShowForm(true)}>Add First Product</button>
                            </div>
                        ) : (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Rating</th>
                                            <th>Badges</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((p) => (
                                            <tr key={p._id}>
                                                <td>
                                                    <div className="admin-product-cell">
                                                        <img
                                                            src={p.image || ''}
                                                            alt={p.name}
                                                            className="admin-product-thumb"
                                                            onError={(e) => imgFallback(e, p.category)}
                                                        />
                                                        <div>
                                                            <div className="admin-product-name">{p.name}</div>
                                                            <div className="admin-product-desc">{p.description?.slice(0, 45)}{p.description?.length > 45 ? '…' : ''}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="admin-cat-badge">{p.category}</span></td>
                                                <td>
                                                    <div className="admin-price-cell">
                                                        <span className="admin-price">₹{p.price?.toLocaleString('en-IN')}</span>
                                                        {p.originalPrice > 0 && (
                                                            <span className="admin-original-price">₹{p.originalPrice?.toLocaleString('en-IN')}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`admin-stock-badge ${p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : 'ok'}`}>
                                                        {p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? `Low (${p.stock})` : p.stock}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="admin-rating">
                                                        ⭐ {p.rating || '4.0'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="admin-badge-row">
                                                        {p.isFeatured && <span className="admin-mini-badge feat">Featured</span>}
                                                        {p.isNewArrival && <span className="admin-mini-badge new">New</span>}
                                                        {p.isBestSeller && <span className="admin-mini-badge best">Best</span>}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="admin-action-row">
                                                        <button className="admin-edit-btn" onClick={() => { setEditProduct(p); setShowForm(true); }} title="Edit">✏️ Edit</button>
                                                        <button className="admin-delete-btn" onClick={() => setDeleteTarget(p)} title="Delete">🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Orders tab ── */}
                {activeTab === 'Orders' && (
                    <div className="admin-section">
                        <div className="admin-section-header">
                            <div>
                                <h1 className="admin-page-title">Orders</h1>
                                <p className="admin-page-sub">{orders.length} total orders</p>
                            </div>
                        </div>

                        {/* Status filter pills */}
                        <div className="admin-filter-row">
                            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                <button
                                    key={s}
                                    className={`admin-filter-pill ${orderFilter === s ? 'active' : ''}`}
                                    onClick={() => setOrderFilter(s)}
                                >
                                    {s === 'all' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}
                                    {s === 'pending' && pendingOrders > 0 && <span className="admin-pill-count">{pendingOrders}</span>}
                                </button>
                            ))}
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="admin-empty">
                                <div className="admin-empty-icon">📭</div>
                                <h3>No orders found</h3>
                            </div>
                        ) : (
                            <div className="admin-orders-grid">
                                {filteredOrders.map((order) => {
                                    const st = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                                    return (
                                        <div key={order._id} className="admin-order-card">
                                            <div className="admin-order-top">
                                                <div className="admin-order-id">
                                                    <span className="admin-order-hash">#</span>
                                                    {order._id?.slice(-6).toUpperCase()}
                                                </div>
                                                <span className="admin-order-status" style={{ background: st.bg, color: st.color }}>
                                                    <span className="admin-status-dot" style={{ background: st.dot }} />
                                                    {order.status}
                                                </span>
                                            </div>

                                            <div className="admin-order-date">
                                                🕐 {new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>

                                            <div className="admin-order-customer">
                                                <div className="admin-customer-name">👤 {order.customer?.name}</div>
                                                <div className="admin-customer-detail">📞 {order.customer?.phone}</div>
                                                <div className="admin-customer-detail">📍 {order.customer?.address}</div>
                                            </div>

                                            <div className="admin-order-items">
                                                {order.items?.map((item, i) => (
                                                    <div key={i} className="admin-order-item-row">
                                                        <span>{item.name} <span className="admin-qty">×{item.quantity}</span></span>
                                                        <span className="admin-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                    </div>
                                                ))}
                                                <div className="admin-order-total-row">
                                                    <span>Total</span>
                                                    <span className="admin-order-total">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>

                                            <div className="admin-status-update">
                                                <span className="admin-update-label">Update Status:</span>
                                                <div className="admin-status-btns">
                                                    {Object.entries(STATUS_COLORS).map(([key, val]) =>
                                                        order.status !== key && (
                                                            <button
                                                                key={key}
                                                                className="admin-status-btn"
                                                                style={{ borderColor: val.color, color: val.color }}
                                                                onClick={() => handleStatusChange(order._id, key)}
                                                            >
                                                                {key}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showForm && <ProductForm product={editProduct} onSave={handleSave} onClose={() => { setShowForm(false); setEditProduct(null); }} />}
            {deleteTarget && <DeleteConfirm product={deleteTarget} onConfirm={handleConfirmDelete} onCancel={() => setDeleteTarget(null)} />}
        </div>
    );
}
