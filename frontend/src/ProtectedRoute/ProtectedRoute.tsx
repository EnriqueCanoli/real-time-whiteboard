import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../contexts/store';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    if (!accessToken) {
        // If no access token, redirect to login page
        return <Navigate to="/login" />;
    }

    return <Component />;
};

export default ProtectedRoute;