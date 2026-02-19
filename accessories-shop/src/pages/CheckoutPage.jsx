import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderAPI } from '../utils/api';
import { sendWhatsAppOrder, formatCurrency } from '../utils/whatsapp';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    if (cartItems.length === 0) {
        navigate('/');
        return null;
    }

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit phone number';
        if (!form.address.trim()) e.address = 'Address is required';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        // ✅ Open WhatsApp FIRST — must be synchronous (direct user click)
        // Browser blocks window.open() if called after any await
        sendWhatsAppOrder(cartItems, cartTotal, form);

        // Generate local order number
        const orderNumber = `WLO-${Date.now()}`;

        // Clear cart and navigate to confirm page
        clearCart();
        navigate('/order-confirm', { state: { orderNumber, customer: form, total: cartTotal } });

        // Save order to backend in the background (optional, won't block WhatsApp)
        const orderPayload = {
            items: cartItems.map((i) => ({ productId: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
            totalAmount: cartTotal,
            customer: form,
        };
        orderAPI.create(orderPayload).catch(() => {
            // Backend unavailable — order still sent via WhatsApp ✅
        });
    };

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
    };

    return (
        <main className="page">
            <div className="checkout-layout">
                {/* Form */}
                <div className="checkout-form-card">
                    <h1 className="page-title">📋 Checkout</h1>
                    <p className="page-subtitle">Your order will be sent to our WhatsApp</p>

                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ravi Kumar" className={errors.name ? 'input-error' : ''} />
                            {errors.name && <span className="error-msg">{errors.name}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number *</label>
                            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="e.g. 9876543210" maxLength={10} className={errors.phone ? 'input-error' : ''} />
                            {errors.phone && <span className="error-msg">{errors.phone}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Delivery Address *</label>
                            <textarea id="address" name="address" value={form.address} onChange={handleChange} placeholder="House No, Street, City, Pincode" rows={3} className={errors.address ? 'input-error' : ''} />
                            {errors.address && <span className="error-msg">{errors.address}</span>}
                        </div>

                        <div className="whatsapp-note">
                            <span>📲</span>
                            <p>Clicking "Place Order" will open <strong>WhatsApp</strong> with your order details.</p>
                        </div>

                        <button type="submit" className="btn btn-whatsapp btn-full" disabled={loading}>
                            {loading ? '⏳ Processing...' : '📲 Place Order on WhatsApp'}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                    <h2 className="summary-title">Order Summary</h2>
                    <div className="summary-rows">
                        {cartItems.map((item) => (
                            <div className="summary-row" key={item._id}>
                                <div className="summary-item-info">
                                    <img src={item.image || 'https://via.placeholder.com/48'} alt={item.name} className="summary-item-img" onError={(e) => (e.target.src = 'https://via.placeholder.com/48')} />
                                    <div>
                                        <p className="summary-item-name">{item.name}</p>
                                        <p className="summary-item-qty">× {item.quantity}</p>
                                    </div>
                                </div>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-total">
                        <span>Total</span>
                        <span>{formatCurrency(cartTotal)}</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
