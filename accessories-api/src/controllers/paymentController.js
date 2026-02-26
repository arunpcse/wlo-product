const razorpay = require('../config/razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');
const crypto = require('crypto');

// Helper: Recalculate total and verify stock
const validateOrder = async (items) => {
    let total = 0;
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.name}`);
        if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
        total += product.price * item.quantity;
    }
    return total;
};

// @desc    Initiate payment - Create Razorpay order
// @route   POST /api/payments/initiate
// @access  Public (or Private with JWT)
exports.initiatePayment = async (req, res) => {
    try {
        const { items, customer } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // 1. Recalculate total and verify stock (Never trust frontend price)
        const totalAmount = await validateOrder(items);

        // 2. Create Razorpay order
        const options = {
            amount: totalAmount * 100, // Razorpay works in paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
        };

        const rzpOrder = await razorpay.orders.create(options);

        // 4. Add basic fraud check (e.g. high value orders)
        const isFlagged = totalAmount > 50000;

        // 5. Create Pending Order in DB
        const order = await Order.create({
            items,
            totalAmount,
            customer,
            razorpayOrderId: rzpOrder.id,
            status: 'pending',
            paymentStatus: 'pending',
            ipAddress: req.ip || req.headers['x-forwarded-for'],
            isFlagged
        });

        res.status(201).json({
            success: true,
            orderId: rzpOrder.id,
            amount: options.amount,
            currency: options.currency,
            dbOrderId: order._id
        });

    } catch (error) {
        console.error('Payment Initiation Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify payment signature
// @route   POST /api/payments/verify
// @access  Public
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            dbOrderId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(body.toString())
            .digest('hex');

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (isSignatureValid) {
            // Update order in DB
            const order = await Order.findById(dbOrderId);
            if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

            order.paymentStatus = 'paid';
            order.status = 'confirmed';
            order.razorpayPaymentId = razorpay_payment_id;
            order.razorpaySignature = razorpay_signature;

            // Deduct stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity }
                });
            }

            await order.save();

            res.json({ success: true, message: 'Payment verified successfully', orderId: order.orderNumber });
        } else {
            // Potential fraud or manipulation
            await Order.findByIdAndUpdate(dbOrderId, {
                paymentStatus: 'failed',
                isFlagged: true
            });
            res.status(400).json({ success: false, message: 'Invalid signature. Payment failed.' });
        }

    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Handle Razorpay Webhooks
// @route   POST /api/payments/webhook
// @access  Public
exports.handleWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';
        const signature = req.headers['x-razorpay-signature'];

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (expectedSignature !== signature) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        const { event, payload } = req.body;

        if (event === 'payment.captured') {
            const payment = payload.payment.entity;
            const order = await Order.findOne({ razorpayOrderId: payment.order_id });
            if (order && order.paymentStatus !== 'paid') {
                order.paymentStatus = 'paid';
                order.status = 'confirmed';
                order.razorpayPaymentId = payment.id;
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
                }
                await order.save();
            }
        }
        res.json({ status: 'ok' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Refund Order (Admin Only)
// @route   POST /api/payments/refund/:id
// @access  Private/Admin
exports.refundOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.paymentStatus !== 'paid') return res.status(400).json({ success: false, message: 'Only paid orders can be refunded' });

        const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
            amount: order.totalAmount * 100,
            notes: { reason: req.body.reason || 'Customer request' }
        });

        order.paymentStatus = 'refunded';
        order.status = 'cancelled';
        await order.save();

        res.json({ success: true, data: refund, message: 'Refund processed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
