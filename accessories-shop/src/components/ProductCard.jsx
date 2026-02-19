import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const STAR_FULL = '★', STAR_EMPTY = '☆';

function Stars({ rating }) {
    return (
        <span className="stars">
            {Array.from({ length: 5 }, (_, i) =>
                <span key={i} style={{ color: i < Math.floor(rating) ? '#FF6B00' : '#D1D5DB' }}>
                    {i < Math.floor(rating) ? STAR_FULL : STAR_EMPTY}
                </span>
            )}
        </span>
    );
}

export default function ProductCard({ product, showAdminActions, onEdit, onDelete }) {
    const { addToCart, openCart } = useCart();
    const { addToast } = useToast();

    const handleAdd = () => {
        if (product.stock === 0) return;
        addToCart(product);
        addToast(`"${product.name}" added to cart 🛒`, 'success');
        openCart();
    };

    return (
        <article className="product-card">
            <div className="product-image-wrapper">
                <img
                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                />
                <span className="product-category-badge">{product.category}</span>
                {product.stock > 0 && product.stock <= 10 && (
                    <span className="stock-warning">Only {product.stock} left!</span>
                )}
                {product.stock === 0 && <div className="out-of-stock-badge">Out of Stock</div>}
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-rating">
                    <Stars rating={product.rating || 4} />
                    <span className="rating-value">({product.rating || 4.0})</span>
                </div>

                <div className="product-footer">
                    <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
                    {showAdminActions ? (
                        <div className="admin-actions">
                            <button className="btn btn-edit" onClick={() => onEdit(product)}>✏️ Edit</button>
                            <button className="btn btn-delete" onClick={() => onDelete(product)}>🗑️</button>
                        </div>
                    ) : (
                        <button className="btn btn-primary" onClick={handleAdd} disabled={product.stock === 0}>
                            {product.stock === 0 ? 'Out of Stock' : '+ Add'}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
