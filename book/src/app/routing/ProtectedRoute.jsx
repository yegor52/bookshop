import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ 
    children, 
    allowedRoles = [], 
    redirectPath = '/auth' 
}) => {
    const { isAuthenticated, getUserRole } = useAuth();
    
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }
    
    if (allowedRoles.length > 0) {
        const userRole = getUserRole();
        if (!allowedRoles.map(r => r.toLowerCase()).includes(userRole?.toLowerCase())) {
            if (userRole === 'manager') return <Navigate to="/manager/orders" replace />;
            return <Navigate to="/auth" replace />;
        }
    }
    
    return children;    
}

export default ProtectedRoute