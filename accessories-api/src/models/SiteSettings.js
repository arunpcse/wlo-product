const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    badge: { type: String, default: 'NEW ARRIVAL' },
    title: { type: String, default: 'Premium Accessories' },
    subtitle: { type: String, default: '' },
    cta: { type: String, default: 'Shop Now' },
    link: { type: String, default: '/shop' },
    gradient: { type: String, default: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
    accent: { type: String, default: '#FF6B00' },
    img: { type: String, default: '' },
}, { _id: false });

const categoryImageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String, default: '' },
    sub: { type: String, default: '' },
}, { _id: false });

// Singleton document — only one record ever exists (key: 'main')
const siteSettingsSchema = new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    slides: { type: [slideSchema], default: [] },
    categoryImages: { type: [categoryImageSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
