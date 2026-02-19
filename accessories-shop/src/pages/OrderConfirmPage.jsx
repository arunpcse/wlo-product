import { useLocation, Link } from 'react-router-dom';

export default function OrderConfirmPage() {
    const { state } = useLocation();

    if (!state) return (
        <main className="page-center">
            <div className="confirm-card">
                <div className="confirm-icon">📦</div>
                <h1>Order Not Found</h1>
                <Link to="/" className="btn btn-primary">Go to Shop</Link>
            </div>
        </main>
    );

    const { orderNumber, customer, total } = state;

    return (
        <main className="page-center">
            <div className="confirm-card">
                <div className="confirm-icon success-bounce">✅</div>
                <h1 className="confirm-title">Order Placed!</h1>
                <p className="confirm-subtitle">Your order has been sent to WhatsApp successfully.</p>

                <div className="confirm-details">
                    <div className="confirm-row">
                        <span>Order #</span>
                        <strong>{orderNumber}</strong>
                    </div>
                    <div className="confirm-row">
                        <span>Name</span>
                        <strong>{customer.name}</strong>
                    </div>
                    <div className="confirm-row">
                        <span>Phone</span>
                        <strong>{customer.phone}</strong>
                    </div>
                    <div className="confirm-row">
                        <span>Total</span>
                        <strong className="confirm-total">₹{total.toLocaleString('en-IN')}</strong>
                    </div>
                </div>

                <div className="confirm-note">
                    <span>📲</span>
                    <p>We'll confirm your order on WhatsApp. Keep your phone handy!</p>
                </div>

                <Link to="/" className="btn btn-primary btn-full">🏪 Continue Shopping</Link>
            </div>
        </main>
    );
}
