
import React from 'react';
import SignupForm from '../../components/Auth/SignupForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../contexts/store';
import { Navigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    if (accessToken) {
        return <Navigate to="/home" />;
    }
    return (
        <div>
            <h2>Sign Up</h2>
            <SignupForm />
        </div>
    );
};

export default SignupPage;
