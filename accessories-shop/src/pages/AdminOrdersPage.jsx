import { useState, useEffect, useCallback } from 'react';
import { orderAPI } from '../utils/api';

const STATUS_COLORS = {
    pending: { bg: '#fff3e0', color: '#e65100', label: 'Pending' },
    confirmed: { bg: '#e8f5e9', color: '#2e7d32', label: 'Confirmed' },
    shipped: { bg: '#e3f2fd', color: '#1565c0', label: 'Shipped' },
    delivered: { bg: '#ede7f6', color: '#4527a0', label: 'Delivered' },
    cancelled: { bg: '#fce4ec', color: '#c62828', label: 'Cancelled' },
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    const fetchOrders = useCallback(async () => {
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const res = await orderAPI.getAll(params);
            setOrders(res.data.data ?? []);
            setError(null);
        } catch (err) {
            setError('Could not load orders. Make sure you are logged in as admin.');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateStatus = async (id, status) => {
        try {
            await orderAPI.updateStatus(id, status);
            setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
        } catch {
            alert('Failed to update order status.');
        }
    };

    const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

    return (
        <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📦 Orders</h1>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>{orders.length} total orders</p>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        style={{
                            padding: '0.4rem 1rem',
                            borderRadius: 20,
                            border: '2px solid',
                            borderColor: filter === s ? '#ff6b00' : '#ddd',
                            background: filter === s ? '#ff6b00' : '#fff',
                            color: filter === s ? '#fff' : '#555',
                            cursor: 'pointer',
                            fontWeight: filter === s ? 700 : 400,
                            textTransform: 'capitalize',
                        }}
                    >
                        {s === 'all' ? 'All' : STATUS_COLORS[s]?.label ?? s}
                    </button>
                ))}
            </div>

            {loading && <p style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading orders…</p>}
            {error && <p style={{ textAlign: 'center', padding: '3rem', color: '#c62828' }}>{error}</p>}
            {!loading && !error && filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>
                    <p style={{ fontSize: '3rem' }}>📭</p>
                    <p>No orders found</p>
                </div>
            )}

            {filtered.map((order) => {
                const st = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                return (
                    <div key={order._id} style={{
                        background: '#fff',
                        border: '1px solid #eee',
                        borderRadius: 12,
                        padding: '1.25rem',
                        marginBottom: '1rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                        {/* Header row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                                <span style={{ fontWeight: 700, fontSize: '1rem' }}>#{order._id?.slice(-6).toUpperCase()}</span>
                                <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: '0.75rem' }}>
                                    {new Date(order.createdAt).toLocaleString('en-IN')}
                                </span>
                            </div>
                            <span style={{
                                background: st.bg, color: st.color,
                                padding: '0.25rem 0.75rem', borderRadius: 20,
                                fontWeight: 700, fontSize: '0.8rem',
                            }}>
                                {st.label}
                            </span>
                        </div>

                        {/* Customer */}
                        <div style={{ margin: '0.75rem 0', padding: '0.75rem', background: '#f9f9f9', borderRadius: 8 }}>
                            <strong>{order.customer?.name}</strong>
                            <span style={{ color: '#555', marginLeft: '0.5rem' }}>📞 {order.customer?.phone}</span>
                            <p style={{ margin: '0.25rem 0 0', color: '#666', fontSize: '0.9rem' }}>📍 {order.customer?.address}</p>
                        </div>

                        {/* Items */}
                        <div style={{ marginBottom: '0.75rem' }}>
                            {order.items?.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '0.25rem 0', borderBottom: '1px solid #f0f0f0' }}>
                                    <span>{item.name} × {item.quantity}</span>
                                    <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '0.5rem', fontSize: '1rem' }}>
                                <span>Total</span>
                                <span style={{ color: '#ff6b00' }}>₹{order.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Status update */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', color: '#888', alignSelf: 'center' }}>Update:</span>
                            {Object.entries(STATUS_COLORS).map(([key, val]) => (
                                order.status !== key && (
                                    <button
                                        key={key}
                                        onClick={() => updateStatus(order._id, key)}
                                        style={{
                                            padding: '0.3rem 0.75rem',
                                            borderRadius: 20,
                                            border: `1px solid ${val.color}`,
                                            background: '#fff',
                                            color: val.color,
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        {val.label}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
