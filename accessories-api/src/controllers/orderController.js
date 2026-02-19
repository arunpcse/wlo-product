const Order = require('../models/Order');

// POST /api/orders
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, customer } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Order must have at least one item' });
        }
        if (!customer?.name || !customer?.phone || !customer?.address) {
            return res.status(400).json({ success: false, message: 'Customer name, phone and address are required' });
        }
        const order = await Order.create({ items, totalAmount, customer, whatsappSent: true });
        res.status(201).json({ success: true, data: order, message: 'Order placed successfully!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// GET /api/orders (admin)
const getOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = status ? { status } : {};
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Order.countDocuments(query);
        res.json({ success: true, data: orders, total });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/orders/:id/status (admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, data: order, message: 'Order status updated' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
