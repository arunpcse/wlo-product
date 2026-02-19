const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    originalPrice: { type: Number, default: null },          // null = no discount shown
    category: { type: String, required: [true, 'Category is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    specifications: { type: Map, of: String, default: {} },  // e.g. {"Brand":"WLO","Material":"Silicone"}
    stock: { type: Number, default: 0, min: 0 },
    image: { type: String, default: '' },
    images: [{ type: String }],                       // extra gallery images
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    tags: [{ type: String }],
}, { timestamps: true });

// Auto-update rating average when a review is added
productSchema.methods.updateRating = function () {
    if (this.reviews.length === 0) { this.rating = 0; this.reviewCount = 0; return; }
    this.rating = +(this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length).toFixed(1);
    this.reviewCount = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
