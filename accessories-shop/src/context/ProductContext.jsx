import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productAPI } from '../utils/api';

const ProductContext = createContext();

const SAMPLE_PRODUCTS = [
  { _id: 'sample1', name: 'Premium Tempered Glass', price: 299, category: 'Screen Protection', description: '9H hardness anti-scratch screen protector.', stock: 50, image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80', rating: 4.5 },
  { _id: 'sample2', name: 'Fast Charging Cable (Type-C)', price: 199, category: 'Cables & Chargers', description: 'Braided nylon 3A fast charging cable, 2m.', stock: 100, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80', rating: 4.8 },
  { _id: 'sample3', name: 'Wireless Bluetooth Earbuds', price: 1499, category: 'Audio', description: 'True wireless ANC earbuds, 24hr battery, IPX5.', stock: 25, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80', rating: 4.7 },
  { _id: 'sample4', name: 'Shockproof Phone Case', price: 349, category: 'Phone Cases', description: 'Military-grade drop protection for all phones.', stock: 75, image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80', rating: 4.6 },
  { _id: 'sample5', name: '20W Fast Wall Charger', price: 599, category: 'Cables & Chargers', description: 'Universal 20W PD charger, compact design.', stock: 60, image: 'https://images.unsplash.com/photo-1609429019995-8c40f49535a5?w=400&q=80', rating: 4.4 },
  { _id: 'sample6', name: 'Magnetic Car Mount', price: 449, category: 'Car Accessories', description: 'Strong magnetic vent mount, 360° rotation.', stock: 40, image: 'https://images.unsplash.com/photo-1617870952348-7524edfb61d7?w=400&q=80', rating: 4.3 },
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  const fetchProducts = useCallback(async () => {
    // Always load from localStorage first (instant, works offline)
    const local = localStorage.getItem('wlo_products');
    const localProducts = local ? JSON.parse(local) : SAMPLE_PRODUCTS;
    setProducts(localProducts);
    setCategories([...new Set(localProducts.map((p) => p.category))]);
    setUseLocalFallback(true);
    setLoading(false);

    // Silently try to sync from backend if available
    try {
      const res = await productAPI.getAll();
      const apiProducts = res.data.data;
      if (apiProducts.length > 0) {
        setProducts(apiProducts);
        const catRes = await productAPI.getCategories();
        setCategories(catRes.data.data);
        setUseLocalFallback(false);
      }
    } catch {
      // Backend offline — localStorage already loaded above, no action needed
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Save to localStorage whenever products change (fallback mode)
  useEffect(() => {
    if (useLocalFallback) {
      localStorage.setItem('wlo_products', JSON.stringify(products));
    }
  }, [products, useLocalFallback]);

  const addProduct = async (data) => {
    if (useLocalFallback) {
      const newProduct = { ...data, _id: `local_${Date.now()}`, rating: 4.0, isActive: true, createdAt: new Date().toISOString() };
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    }
    const res = await productAPI.create(data);
    setProducts((prev) => [res.data.data, ...prev]);
    return res.data.data;
  };

  const updateProduct = async (id, data) => {
    if (useLocalFallback) {
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, ...data } : p)));
      return;
    }
    const res = await productAPI.update(id, data);
    setProducts((prev) => prev.map((p) => (p._id === id ? res.data.data : p)));
  };

  const deleteProduct = async (id) => {
    if (useLocalFallback) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      return;
    }
    await productAPI.delete(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, categories, loading, error, useLocalFallback, fetchProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
