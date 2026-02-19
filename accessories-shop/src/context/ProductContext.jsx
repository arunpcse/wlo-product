import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { productAPI } from '../utils/api';

const ProductContext = createContext();

// ------------------------------------------------------------------
// Fallback shown ONLY when the API is completely unreachable
// ------------------------------------------------------------------
const FALLBACK_PRODUCTS = [
  { _id: 'sample1', name: 'Premium Tempered Glass', price: 299, category: 'Screen Protection', description: '9H hardness anti-scratch screen protector.', stock: 50, image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80', rating: 4.5 },
  { _id: 'sample2', name: 'Fast Charging Cable (Type-C)', price: 199, category: 'Cables & Chargers', description: 'Braided nylon 3A fast charging cable, 2m.', stock: 100, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80', rating: 4.8 },
  { _id: 'sample3', name: 'Wireless Bluetooth Earbuds', price: 1499, category: 'Audio', description: 'True wireless ANC earbuds, 24hr battery, IPX5.', stock: 25, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80', rating: 4.7 },
  { _id: 'sample4', name: 'Shockproof Phone Case', price: 349, category: 'Phone Cases', description: 'Military-grade drop protection for all phones.', stock: 75, image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80', rating: 4.6 },
  { _id: 'sample5', name: '20W Fast Wall Charger', price: 599, category: 'Cables & Chargers', description: 'Universal 20W PD charger, compact design.', stock: 60, image: 'https://images.unsplash.com/photo-1609429019995-8c40f49535a5?w=400&q=80', rating: 4.4 },
  { _id: 'sample6', name: 'Magnetic Car Mount', price: 449, category: 'Car Accessories', description: 'Strong magnetic vent mount, 360° rotation.', stock: 40, image: 'https://images.unsplash.com/photo-1617870952348-7524edfb61d7?w=400&q=80', rating: 4.3 },
];

// How often (ms) we re-fetch from the server to sync across devices
const SYNC_INTERVAL_MS = 30_000; // 30 seconds

// Purge ALL old localStorage keys from previous versions of the app
// so old devices don't show stale data
const purgeOldCache = () => {
  ['wlo_products', 'wlo_cache_products', 'wlo_cache_categories'].forEach((key) => {
    localStorage.removeItem(key);
  });
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const intervalRef = useRef(null);

  // ── Fetch from API — ALWAYS the primary source ─────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        productAPI.getAll(),
        productAPI.getCategories(),
      ]);

      const apiProducts = prodRes.data.data ?? [];
      const apiCategories = catRes.data.data ?? [];

      setProducts(apiProducts);
      setCategories(apiCategories);
      setIsOffline(false);
      setError(null);
    } catch (err) {
      console.warn('⚠️  API unreachable — using fallback.', err.message);
      setIsOffline(true);
      // Only show fallback samples if we have truly nothing
      setProducts((prev) => prev.length > 0 ? prev : FALLBACK_PRODUCTS);
      setCategories((prev) => prev.length > 0 ? prev : [...new Set(FALLBACK_PRODUCTS.map((p) => p.category))]);
      setError('Could not reach server. Showing sample data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Initial load + polling ──────────────────────────────────────────
  useEffect(() => {
    // Wipe all old localStorage caches from previous app versions
    // This ensures every device always reads fresh data from MongoDB
    purgeOldCache();

    fetchProducts();

    // Poll every 30s — changes on another device appear automatically
    intervalRef.current = setInterval(fetchProducts, SYNC_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchProducts]);

  // ── CRUD — always hits the API; offline falls back to local state ───
  const addProduct = async (data) => {
    if (isOffline) {
      const newProduct = { ...data, _id: `local_${Date.now()}`, rating: 4.0, isActive: true, createdAt: new Date().toISOString() };
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    }
    const res = await productAPI.create(data);
    const created = res.data.data;
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const updateProduct = async (id, data) => {
    if (isOffline) {
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, ...data } : p)));
      return;
    }
    const res = await productAPI.update(id, data);
    setProducts((prev) => prev.map((p) => (p._id === id ? res.data.data : p)));
  };

  const deleteProduct = async (id) => {
    if (isOffline) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      return;
    }
    await productAPI.delete(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      loading,
      error,
      isOffline,
      fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
