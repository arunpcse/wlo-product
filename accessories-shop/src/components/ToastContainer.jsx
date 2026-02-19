import { useToast } from '../context/ToastContext';

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();
    return (
        <div className="toast-container" aria-live="polite">
            {toasts.map((t) => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    <span className="toast-icon">{ICONS[t.type] || '✅'}</span>
                    <span className="toast-msg">{t.message}</span>
                    <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
                </div>
            ))}
        </div>
    );
}
