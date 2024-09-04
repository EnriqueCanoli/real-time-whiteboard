import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true, // Ensure cookies are sent with requests
});

// Handle successful responses
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                const response = await axios.post('http://localhost:5000/auth/refresh-token', {}, { withCredentials: true });
                const { accessToken } = response.data;

                // Update the access token in axios headers
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                // Retry the original request with the new access token
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Handle logout or redirect to login page
                // Example: window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
