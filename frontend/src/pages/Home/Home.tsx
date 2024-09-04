import React, { useEffect } from 'react';
import './Home.css';
import axiosInstance from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../contexts/store';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../../components/Auth/LogoutButton';


const Home: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const status = useSelector((state: RootState) => state.auth.status);
    const error = useSelector((state: RootState) => state.auth.error);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get('/users')
            .then(response => {
                console.log('Protected data:', response.data);
            })
            .catch(error => {
                console.error('Error fetching protected data:', error);
            });

    }, [user, navigate]);

    return (
        <div className='home-container'>
            <header className='header'>
                <h1>Real-time collaborative whiteboard</h1>
                <LogoutButton />
            </header>
            <main className='main-content'>
                {status === 'loading' && <p>Loading...</p>}
                {status === 'failed' && <p>{error}</p>}
                {user ? (
                    <div className='whiteboard-placeholder'>
                        <p>Welcome, {user.name}! Here's your whiteboard area.</p>
                    </div>
                ) : (
                    <p>Please log in to access the whiteboard.</p>
                )}
            </main>
        </div>
    );
}

export default Home;