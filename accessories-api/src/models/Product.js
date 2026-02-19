const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    category: { type: String, required: [true, 'Category is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    stock: { type: Number, default: 0, min: 0 },
    image: { type: String, default: '' },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
