import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try { return JSON.parse(localStorage.getItem('wlo_cart')) || []; }
        catch { return []; }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('wlo_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i._id === product._id);
            if (existing) {
                return prev.map((i) => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((i) => i._id !== id));
    };

    const updateQuantity = (id, qty) => {
        if (qty < 1) { removeFromCart(id); return; }
        setCartItems((prev) => prev.map((i) => i._id === id ? { ...i, quantity: qty } : i));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('wlo_cart');
    };

    const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
    const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, cartTotal, isCartOpen, addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
