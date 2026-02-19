import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { orderAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import DeleteConfirm from '../components/DeleteConfirm';

const TABS = ['Products', 'Orders'];

export default function AdminPage() {
    const { products, addProduct, updateProduct, deleteProduct, useLocalFallback } = useProducts();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('Products');
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [orders, setOrders] = useState([]);
    const [ordersLoaded, setOrdersLoaded] = useState(false);

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
                addToast('✅ Product updated!', 'success');
            } else {
                await addProduct(formData);
                addToast('✅ Product added!', 'success');
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
            addToast('🗑️ Product deleted', 'info');
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
            addToast('Could not update status (backend offline)', 'error');
        }
    };

    return (
        <main className="page">
            {/* Admin Header */}
            <section className="admin-hero">
                <div className="admin-hero-content">
                    <div>
                        <h1 className="page-title">⚙️ Admin Panel</h1>
                        <p className="page-subtitle">World Line Out — Product & Order Management {useLocalFallback ? '(Offline Mode)' : ''}</p>
                    </div>
                    {activeTab === 'Products' && (
                        <button className="btn btn-primary btn-large" onClick={() => { setEditProduct(null); setShowForm(true); }}>
                            ➕ Add Product
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div className="admin-stats">
                    <div className="admin-stat-card"><span className="admin-stat-number">{products.length}</span><span className="admin-stat-label">Products</span></div>
                    <div className="admin-stat-card"><span className="admin-stat-number">{products.filter(p => p.stock > 0).length}</span><span className="admin-stat-label">In Stock</span></div>
                    <div className="admin-stat-card"><span className="admin-stat-number">{products.filter(p => p.stock === 0).length}</span><span className="admin-stat-label">Out of Stock</span></div>
                    <div className="admin-stat-card"><span className="admin-stat-number">{orders.length}</span><span className="admin-stat-label">Orders</span></div>
                </div>

                {/* Tabs */}
                <div className="admin-tabs">
                    {TABS.map((tab) => (
                        <button key={tab} className={`admin-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => handleTabChange(tab)}>{tab}</button>
                    ))}
                </div>
            </section>

            {/* Products Tab */}
            {activeTab === 'Products' && (
                <section className="products-section">
                    <div className="section-header">
                        <h2 className="section-title">All Products</h2>
                        <span className="results-count">{products.length} items</span>
                    </div>
                    {products.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h3>No products yet</h3>
                            <button className="btn btn-primary" onClick={() => setShowForm(true)}>➕ Add First Product</button>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map((p) => (
                                <ProductCard key={p._id} product={p} showAdminActions
                                    onEdit={(product) => { setEditProduct(product); setShowForm(true); }}
                                    onDelete={setDeleteTarget} />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Orders Tab */}
            {activeTab === 'Orders' && (
                <section className="orders-section">
                    <div className="section-header">
                        <h2 className="section-title">All Orders</h2>
                        <span className="results-count">{orders.length} orders</span>
                    </div>
                    {orders.length === 0 ? (
                        <div className="empty-state"><div className="empty-icon">📦</div><h3>No orders yet</h3></div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order._id} className="order-card">
                                    <div className="order-card-header">
                                        <div>
                                            <strong className="order-number">{order.orderNumber}</strong>
                                            <span className={`order-status status-${order.status}`}>{order.status}</span>
                                        </div>
                                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                                    </div>
                                    <div className="order-customer">
                                        <p>👤 {order.customer.name} | 📞 {order.customer.phone}</p>
                                        <p>📍 {order.customer.address}</p>
                                    </div>
                                    <div className="order-items-list">
                                        {order.items.map((item, i) => (
                                            <span key={i} className="order-item-tag">{item.name} × {item.quantity}</span>
                                        ))}
                                    </div>
                                    <div className="order-footer">
                                        <strong className="order-total">₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                                        <select className="status-select" value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                                            {['pending', 'confirmed', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Modals */}
            {showForm && <ProductForm product={editProduct} onSave={handleSave} onClose={() => { setShowForm(false); setEditProduct(null); }} />}
            {deleteTarget && <DeleteConfirm product={deleteTarget} onConfirm={handleConfirmDelete} onCancel={() => setDeleteTarget(null)} />}
        </main>
    );
}
