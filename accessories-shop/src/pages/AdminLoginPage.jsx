import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
            addToast('❌ Wrong password. Try again.', 'error');
        }
    };

    return (
        <main className="page-center login-page">
            <div className="login-card">
                <div className="login-icon">🔐</div>
                <h1 className="login-title">Admin Login</h1>
                <p className="login-sub">Enter your admin password to manage products</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            autoFocus
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full">
                        🔓 Login
                    </button>
                </form>
            </div>
        </main>
    );
}
