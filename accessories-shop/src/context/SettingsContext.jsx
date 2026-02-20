import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsAPI } from '../utils/api';

const SettingsContext = createContext();

const DEFAULT_SLIDES = [
    {
        badge: 'MEGA DEALS',
        title: 'Best Deals on\nPremium Accessories',
        subtitle: 'Up to 40% OFF on top-rated mobile accessories. Limited time offer!',
        cta: 'Shop Deals',
        link: '/shop',
        gradient: 'linear-gradient(135deg, #FFF5EB 0%, #FFE8D1 50%, #FFD1A3 100%)',
        accent: '#FF6B00',
        img: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&w=480&q=80',
    },
    {
        badge: '9H HARDNESS',
        title: 'Premium Screen\nProtection Glass',
        subtitle: 'Military-grade tempered glass. Anti-scratch, anti-fingerprint. Starting ₹199.',
        cta: 'View Collection',
        link: '/shop?category=Screen+Protection',
        gradient: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 60%, #BAE6FD 100%)',
        accent: '#00D2FF',
        img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&w=480&q=80',
    },
    {
        badge: 'FAST CHARGING',
        title: 'Built to Last\nCharging Cables',
        subtitle: 'Type-C, Lightning & USB-A cables with ultra-durable braided design.',
        cta: 'Explore Now',
        link: '/shop?category=Cables+%26+Chargers',
        gradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FED7AA 100%)',
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

export function SettingsProvider({ children }) {
    const [slides, setSlides] = useState(DEFAULT_SLIDES);
    const [categoryImages, setCategoryImages] = useState(DEFAULT_CATEGORIES);
    const [settingsId, setSettingsId] = useState(null);

    const fetchSettings = useCallback(async () => {
        try {
            const res = await settingsAPI.get();
            const d = res.data.data;
            if (d.slides?.length) setSlides(d.slides);
            if (d.categoryImages?.length) setCategoryImages(d.categoryImages);
            setSettingsId(d._id);
        } catch {
            // silently keep defaults — site still works if API is slow
        }
    }, []);

    useEffect(() => { fetchSettings(); }, [fetchSettings]);

    const updateSlides = async (newSlides) => {
        const res = await settingsAPI.update({ slides: newSlides });
        setSlides(res.data.data.slides);
    };

    const updateCategoryImages = async (newCats) => {
        const res = await settingsAPI.update({ categoryImages: newCats });
        setCategoryImages(res.data.data.categoryImages);
    };

    return (
        <SettingsContext.Provider value={{ slides, categoryImages, settingsId, updateSlides, updateCategoryImages, fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
