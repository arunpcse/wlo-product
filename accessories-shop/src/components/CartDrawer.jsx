import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
    const { cartItems, cartTotal, cartCount, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCart();

    return (
        <>
            {/* Backdrop */}
            <div className={`drawer-backdrop ${isCartOpen ? 'open' : ''}`} onClick={closeCart} />

            {/* Drawer */}
            <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div>
                        <h2 className="drawer-title">🛒 Your Cart</h2>
                        {cartCount > 0 && <span className="drawer-count">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>}
                    </div>
                    <button className="drawer-close" onClick={closeCart} aria-label="Close cart">✕</button>
                </div>

                <div className="drawer-body">
                    {cartItems.length === 0 ? (
                        <div className="drawer-empty">
                            <span className="drawer-empty-icon">🛒</span>
                            <p>Your cart is empty</p>
                            <button className="btn btn-primary" onClick={closeCart}>Continue Shopping</button>
                        </div>
                    ) : (
                        <>
                            <div className="drawer-items">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="drawer-item">
                                        <img
                                            src={item.image || 'https://via.placeholder.com/60'}
                                            alt={item.name}
                                            className="drawer-item-img"
                                            onError={(e) => (e.target.src = 'https://via.placeholder.com/60')}
                                        />
                                        <div className="drawer-item-info">
                                            <p className="drawer-item-name">{item.name}</p>
                                            <p className="drawer-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                                            <div className="drawer-item-qty">
                                                <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                                                <span>{item.quantity}</span>
                                                <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>
                                        <div className="drawer-item-right">
                                            <span className="drawer-item-subtotal">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                            <button className="drawer-remove" onClick={() => removeFromCart(item._id)} aria-label="Remove">🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="drawer-footer">
                                <div className="drawer-total">
                                    <span>Total</span>
                                    <span className="drawer-total-amount">₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <Link to="/checkout" className="btn btn-primary btn-full drawer-checkout" onClick={closeCart}>
                                    Proceed to Checkout →
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </aside>
        </>
    );
}
