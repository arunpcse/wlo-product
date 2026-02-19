const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 50 } = req.query;
        const query = { isActive: true };
        if (category && category !== 'All') query.category = category;
        if (search) query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Product.countDocuments(query);
        res.json({ success: true, data: products, total, page: Number(page) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/products/:id
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/products (admin)
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product, message: 'Product created successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, data: product, message: 'Product updated successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/products/:id (admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/products/categories
const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category', { isActive: true });
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/products/:id/reviews (public — any customer can review)
const addReview = async (req, res) => {
    try {
        const { name, rating, comment } = req.body;
        if (!name || !rating || !comment) {
            return res.status(400).json({ success: false, message: 'Name, rating and comment are required' });
        }
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        product.reviews.push({ name, rating: Number(rating), comment });
        product.updateRating();
        await product.save();
        res.status(201).json({ success: true, data: product, message: 'Review added!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories, addReview };
