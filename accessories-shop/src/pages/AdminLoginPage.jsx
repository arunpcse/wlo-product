import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password.trim()) { addToast('Please enter password', 'error'); return; }
        try {
            login(password);
            addToast('Welcome back, Admin! 👋', 'success');
            navigate('/admin');
        } catch {
            setPassword('');
            addToast('❌ Wrong password. Try again.', 'error');
        }
    };

    return (
        <main className="login-page-v2">
            <div className="login-card-v2">
                <div className="login-logo-v2">
                    <img src="/wlo-logo.png" alt="WLO Logo" />
                </div>

                <h1 className="login-title-v2">Admin Access</h1>
                <p className="login-sub-v2">Enter your secure password to manage the store</p>

                <form onSubmit={handleSubmit} className="login-form-v2">
                    <div className="form-group">
                        <label htmlFor="password">Administrator Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="login-input-v2"
                            autoFocus
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full btn-large">
                        Unlock Dashboard
                    </button>
                </form>

                <Link to="/" className="login-back-shop">
                    ← Back to Store
                </Link>
            </div>
        </main>
    );
}
