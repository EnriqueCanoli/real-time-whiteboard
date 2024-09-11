import axios from 'axios';
import store from '../contexts/store';
import useAuthRefresh from './useAuthRefresh';
import { loginFailure, refreshToken } from '../contexts/auth/authSlice';


const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true, // Ensure cookies are sent with requests
});

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState(); // Get the current Redux state
        const accessToken = state.auth.accessToken; // Get the access token from Redux
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`; // Add access token to request headers
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle successful responses and refresh tokens if 401 error occurs
axiosInstance.interceptors.response.use(
    response => response,
    async error => {

        if (error.response && error.response.status === 403 ) {
            try {
                const newAccessToken = await useAuthRefresh();
                console.log("new Acces", newAccessToken)
                if (newAccessToken) {
                    error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    store.dispatch(refreshToken({accessToken:newAccessToken}))
                    return axios(error.config); // Retry the original request with new token
                }else{
                    store.dispatch(loginFailure('Invalid credentials'));
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
