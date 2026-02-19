import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState(() => {
        try { return JSON.parse(localStorage.getItem('wlo_wishlist') || '[]'); }
        catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('wlo_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        setWishlist((prev) =>
            prev.find((p) => p._id === product._id) ? prev : [product, ...prev]
        );
    };

    const removeFromWishlist = (id) => {
        setWishlist((prev) => prev.filter((p) => p._id !== id));
    };

    const isInWishlist = (id) => wishlist.some((p) => p._id === id);

    const toggleWishlist = (product) => {
        isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistCount: wishlist.length,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            toggleWishlist,
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}
