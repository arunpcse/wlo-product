import axios from 'axios';

// PRODUCTION: always use Render backend
// VITE_API_URL env var overrides this in local dev
const API_URL = import.meta.env.VITE_API_URL || 'https://wlo-product.onrender.com';


const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('wlo_admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Products
export const productAPI = {
    getAll: (params) => api.get('/api/products', { params }),
    getById: (id) => api.get(`/api/products/${id}`),
    getCategories: () => api.get('/api/products/categories'),
    create: (data) => api.post('/api/products', data),
    update: (id, data) => api.put(`/api/products/${id}`, data),
    delete: (id) => api.delete(`/api/products/${id}`),
};

// Orders
export const orderAPI = {
    create: (data) => api.post('/api/orders', data),
    getAll: (params) => api.get('/api/orders', { params }),
    updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
};

// Auth
export const authAPI = {
    login: (password) => api.post('/api/auth/login', { password }),
    verify: () => api.get('/api/auth/verify'),
};

export default api;
