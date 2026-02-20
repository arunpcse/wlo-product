const SiteSettings = require('../models/SiteSettings');

// Default slides matching what was hardcoded in HomePage
const DEFAULT_SLIDES = [
    {
        badge: 'MEGA DEALS',
        title: 'Best Deals on\nPremium Accessories',
        subtitle: 'Up to 40% OFF on top-rated mobile accessories. Limited time offer!',
        cta: 'Shop Deals',
        link: '/shop',
        gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        accent: '#FF6B00',
        img: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&w=480&q=80',
    },
    {
        badge: '9H HARDNESS',
        title: 'Premium Screen\nProtection Glass',
        subtitle: 'Military-grade tempered glass. Anti-scratch, anti-fingerprint. Starting ₹199.',
        cta: 'View Collection',
        link: '/shop?category=Screen+Protection',
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        accent: '#00D2FF',
        img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&w=480&q=80',
    },
    {
        badge: 'FAST CHARGING',
        title: 'Built to Last\nCharging Cables',
        subtitle: 'Type-C, Lightning & USB-A cables with ultra-durable braided design.',
        cta: 'Explore Now',
        link: '/shop?category=Cables+%26+Chargers',
        gradient: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #2d1b00 100%)',
        accent: '#FFD700',
        img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&w=480&q=80',
    },
];

const DEFAULT_CATEGORIES = [
    { name: 'Screen Protection', img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&w=300&q=75', sub: 'Tempered Glass' },
    { name: 'Cables & Chargers', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&w=300&q=75', sub: 'Fast Charging' },
    { name: 'Audio', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&w=300&q=75', sub: 'Earphones & More' },
    { name: 'Phone Cases', img: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?auto=format&w=300&q=75', sub: 'All Models' },
    { name: 'Car Accessories', img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&w=300&q=75', sub: 'Mounts & More' },
    { name: 'Powerbanks', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&w=300&q=75', sub: '10000mAh+' },
];

// GET /api/settings
const getSettings = async (req, res) => {
    try {
        let settings = await SiteSettings.findOne({ key: 'main' });
        if (!settings) {
            // Seed defaults on first access
            settings = await SiteSettings.create({
                key: 'main',
                slides: DEFAULT_SLIDES,
                categoryImages: DEFAULT_CATEGORIES,
            });
        }
        res.json({ success: true, data: settings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/settings  (admin only)
const updateSettings = async (req, res) => {
    try {
        const settings = await SiteSettings.findOneAndUpdate(
            { key: 'main' },
            { $set: req.body },
            { new: true, upsert: true, runValidators: true }
        );
        res.json({ success: true, data: settings });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

module.exports = { getSettings, updateSettings };
