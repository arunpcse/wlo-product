const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
});

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    status: { type: String, enum: ['pending', 'confirmed', 'delivered', 'cancelled'], default: 'pending' },
    whatsappSent: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `WLO-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
