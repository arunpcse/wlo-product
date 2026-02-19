import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <main className="page">
                <div className="empty-state cart-empty">
                    <div className="empty-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add some amazing mobile accessories to your cart!</p>
                    <Link to="/" className="btn btn-primary">
                        🏪 Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="page">
            <section className="cart-section">
                <div className="cart-header">
                    <h1 className="page-title">🛒 Shopping Cart</h1>
                    <button className="btn btn-ghost" onClick={clearCart}>
                        Clear All
                    </button>
                </div>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img
                                    src={item.image || 'https://via.placeholder.com/80'}
                                    alt={item.name}
                                    className="cart-item-image"
                                    onError={(e) => (e.target.src = 'https://via.placeholder.com/80')}
                                />
                                <div className="cart-item-details">
                                    <h3 className="cart-item-name">{item.name}</h3>
                                    <span className="cart-item-category">{item.category}</span>
                                    <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</div>
                                </div>
                                <div className="cart-item-controls">
                                    <div className="quantity-controls">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            −
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="cart-item-subtotal">
                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item.id)}
                                        title="Remove"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h2 className="summary-title">Order Summary</h2>
                        <div className="summary-rows">
                            {cartItems.map((item) => (
                                <div className="summary-row" key={item.id}>
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-divider" />
                        <div className="summary-total">
                            <span>Total</span>
                            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <button className="btn btn-primary btn-full checkout-btn">
                            🛍️ Proceed to Checkout
                        </button>
                        <Link to="/" className="continue-shopping">
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
