import axios from 'axios';

axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000', // your API base URL
    withCredentials: true, // Ensure cookies are sent with requests
});

export default axiosInstance;