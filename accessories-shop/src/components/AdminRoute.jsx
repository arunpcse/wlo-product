import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
    const { isAdmin, authLoading } = useAuth();
    if (authLoading) return (
        <div className="page-center">
            <div className="spinner" />
        </div>
    );
    return isAdmin ? children : <Navigate to="/admin/login" replace />;
}
