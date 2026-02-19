import { useState, useEffect } from 'react';

const CATEGORIES = ['Screen Protection', 'Cables & Chargers', 'Audio', 'Phone Cases', 'Car Accessories', 'Power Banks', 'Holders & Stands', 'Other'];

export default function ProductForm({ product, onSave, onClose }) {
    const [form, setForm] = useState({
        name: '', price: '', category: CATEGORIES[0], description: '', stock: '', image: '', rating: '4.0',
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || '',
                price: String(product.price || ''),
                category: product.category || CATEGORIES[0],
                description: product.description || '',
                stock: String(product.stock || ''),
                image: product.image || '',
                rating: String(product.rating || '4.0'),
            });
        }
    }, [product]);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Product name is required';
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter a valid price';
        if (!form.description.trim()) e.description = 'Description is required';
        if (form.stock !== '' && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) e.stock = 'Enter valid stock quantity';
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
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
                category: form.category,
                description: form.description.trim(),
                stock: form.stock !== '' ? Number(form.stock) : 0,
                image: form.image.trim(),
                rating: Number(form.rating) || 4.0,
                isActive: true,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
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
                            <label htmlFor="pf-price">Price (₹) *</label>
                            <input id="pf-price" name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="e.g. 299" className={errors.price ? 'input-error' : ''} />
                            {errors.price && <span className="error-msg">{errors.price}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pf-category">Category *</label>
                            <select id="pf-category" name="category" value={form.category} onChange={handleChange}>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="pf-stock">Stock Quantity</label>
                            <input id="pf-stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="e.g. 50" className={errors.stock ? 'input-error' : ''} />
                            {errors.stock && <span className="error-msg">{errors.stock}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pf-desc">Description *</label>
                        <textarea id="pf-desc" name="description" value={form.description} onChange={handleChange} placeholder="Describe the product..." className={errors.description ? 'input-error' : ''} />
                        {errors.description && <span className="error-msg">{errors.description}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="pf-image">Image URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                        <input id="pf-image" name="image" type="url" value={form.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                        {form.image && (
                            <div className="image-preview">
                                <img src={form.image} alt="Preview" onError={(e) => (e.target.style.display = 'none')} />
                            </div>
                        )}
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
