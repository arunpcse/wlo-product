import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsAPI } from '../utils/api';

const SettingsContext = createContext();

const DEFAULT_SLIDES = [
    {
        badge: 'PREMIUM QUALITY',
        title: 'Elevate Your Mobile\nExperience',
        subtitle: 'Discover our curated collection of high-end accessories designed for style and durability.',
        cta: 'Shop Collection',
        link: '/shop',
        gradient: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8D1 100%)',
        accent: '#FF4C00',
        img: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&w=800&q=80',
    },
    {
        badge: 'NEW ARRIVALS',
        title: 'Unmatched Screen\nProtection',
        subtitle: 'Military-grade tempered glass with ultra-clear transparency. Protect your investment.',
        cta: 'View Glass',
        link: '/shop?category=Screen+Protection',
        gradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 100%)',
        accent: '#FF4C00',
        img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&w=800&q=80',
    },
    {
        badge: 'FAST CHARGING',
        title: 'Power That Moves\nWith You',
        subtitle: 'Ultra-durable charging cables and high-capacity powerbanks for the modern professional.',
        cta: 'Explore Power',
        link: '/shop?category=Cables+%26+Chargers',
        gradient: 'linear-gradient(135deg, #FFF5F0 0%, #FFE4D6 100%)',
        accent: '#FF4C00',
        img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&w=800&q=80',
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
