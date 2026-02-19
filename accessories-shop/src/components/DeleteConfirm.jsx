export default function DeleteConfirm({ product, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <div className="modal modal-small">
                <div className="delete-icon">🗑️</div>
                <h2 className="delete-title">Delete Product?</h2>
                <p className="delete-message">
                    Are you sure you want to delete <strong>"{product?.name}"</strong>? This action cannot be undone.
                </p>
                <div className="form-actions" style={{ justifyContent: 'center', gap: '16px' }}>
                    <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                    <button className="btn btn-delete-confirm btn-primary" onClick={onConfirm}>🗑️ Delete</button>
                </div>
            </div>
        </div>
    );
}
