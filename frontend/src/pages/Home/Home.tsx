import React, { useEffect } from 'react';
import './Home.css';
import axiosInstance from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../contexts/store';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../../components/Auth/LogoutButton';
import Whiteboard from '../../components/Whiteboard/Whiteboard';


const Home: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const status = useSelector((state: RootState) => state.auth.status);
    const error = useSelector((state: RootState) => state.auth.error);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken)
    const navigate = useNavigate();


    useEffect(() => {
        console.log("access ", accessToken)
        if(accessToken){
            axiosInstance.get('/users')
            .then(response => {
                console.log('Protected data:', response.data, );
            })
            .catch(error => {
                console.error('Error fetching protected data:', error);
            });

        }
        

    }, [accessToken, navigate]);

    

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
                    <Whiteboard />
                ) : (
                    <p>Please log in to access the whiteboard.</p>
                )}
            </main>
        </div>
    );
}

export default Home;