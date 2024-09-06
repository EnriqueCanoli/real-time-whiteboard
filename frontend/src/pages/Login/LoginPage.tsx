import React from 'react';
import LoginForm from '../../components/Auth/LoginForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../contexts/store';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    if (accessToken) {
        return <Navigate to="/home" />;
    }
    
    return (
        <div>
            <h2>Login</h2>
            <LoginForm />
        </div>
    );
}

export default LoginPage;
