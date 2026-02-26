import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';

const CATEGORIES = ['Screen Protection', 'Cables & Chargers', 'Audio', 'Phone Cases', 'Car Accessories', 'Power Banks', 'Holders & Stands', 'Other'];

export default function ProductForm({ product, onSave, onClose }) {
    const [form, setForm] = useState({
        name: '', price: '', originalPrice: '', category: CATEGORIES[0],
        description: '', stock: '', image: '', rating: '4.0',
        isFeatured: false, isNewArrival: false, isBestSeller: false,
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || '',
                price: String(product.price || ''),
                originalPrice: product.originalPrice ? String(product.originalPrice) : '',
                category: product.category || CATEGORIES[0],
                description: product.description || '',
                stock: String(product.stock || ''),
                image: product.image || '',
                rating: String(product.rating || '4.0'),
                isFeatured: product.isFeatured || false,
                isNewArrival: product.isNewArrival || false,
                isBestSeller: product.isBestSeller || false,
            });
        }
    }, [product]);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Product name is required';
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter a valid price';
        if (!form.description.trim()) e.description = 'Description is required';
        if (form.stock !== '' && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) e.stock = 'Enter valid stock quantity';
        if (form.originalPrice && (isNaN(Number(form.originalPrice)) || Number(form.originalPrice) <= 0)) e.originalPrice = 'Enter valid original price';
        return e;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSaving(true);
        try {
            await onSave({
                name: form.name.trim(),
                price: Number(form.price),
                originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
                category: form.category,
                description: form.description.trim(),
                stock: form.stock !== '' ? Number(form.stock) : 0,
                image: form.image.trim(),
                rating: Number(form.rating) || 4.0,
                isActive: true,
                isFeatured: form.isFeatured,
                isNewArrival: form.isNewArrival,
                isBestSeller: form.isBestSeller,
            });
        } finally {
            setSaving(false);
        }
    };

    const discount = form.originalPrice && form.price
        ? Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)
        : 0;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h2>{product ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pf-name">Product Name *</label>
                            <input id="pf-name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Tempered Glass" className={errors.name ? 'input-error' : ''} />
                            {errors.name && <span className="error-msg">{errors.name}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="pf-category">Category *</label>
                            <select id="pf-category" name="category" value={form.category} onChange={handleChange}>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pf-price">Sale Price (₹) *</label>
                            <input id="pf-price" name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="e.g. 299" className={errors.price ? 'input-error' : ''} />
                            {errors.price && <span className="error-msg">{errors.price}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="pf-original-price">
                                Original Price (₹) <span style={{ color: '#888', fontSize: '0.8rem' }}>for discount badge</span>
                            </label>
                            <input id="pf-original-price" name="originalPrice" type="number" min="0" value={form.originalPrice} onChange={handleChange} placeholder="e.g. 499 (leave blank = no discount)" className={errors.originalPrice ? 'input-error' : ''} />
                            {errors.originalPrice && <span className="error-msg">{errors.originalPrice}</span>}
                            {discount > 0 && <span style={{ color: 'green', fontSize: '0.85rem' }}>✅ {discount}% discount will show</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pf-stock">Stock Quantity</label>
                            <input id="pf-stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="e.g. 50" className={errors.stock ? 'input-error' : ''} />
                            {errors.stock && <span className="error-msg">{errors.stock}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="pf-rating">Initial Rating</label>
                            <input id="pf-rating" name="rating" type="number" min="1" max="5" step="0.1" value={form.rating} onChange={handleChange} placeholder="4.0" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pf-desc">Description *</label>
                        <textarea id="pf-desc" name="description" value={form.description} onChange={handleChange} placeholder="Describe the product..." className={errors.description ? 'input-error' : ''} />
                        {errors.description && <span className="error-msg">{errors.description}</span>}
                    </div>

                    <ImageUploader
                        label="Product Image"
                        value={form.image}
                        onChange={(url) => setForm((p) => ({ ...p, image: url }))}
                    />

                    {/* Product flags */}
                    <div className="form-group">
                        <label>Product Badges</label>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                            {[
                                { name: 'isFeatured', label: '⭐ Featured' },
                                { name: 'isNewArrival', label: '🆕 New Arrival' },
                                { name: 'isBestSeller', label: '🔥 Best Seller' },
                            ].map(({ name, label }) => (
                                <label key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? '⏳ Saving...' : product ? '✅ Update Product' : '➕ Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
