import axiosInstance from './axiosInstance';

const useAuthRefresh = async () => {
    try {
        const response = await axiosInstance.post('/auth/refresh-token', {}, { withCredentials: true });
        
        return response.data.accessToken
    } catch (error) {
        console.error("Failed to refresh token", error);
        return null;
    }

    

    /*const refreshAccessToken = async () => {
        try {
            const response = await axiosInstance.post('/auth/refresh-token', {}, { withCredentials: true });
            const { accessToken } = response.data;
            dispatch(refreshToken(accessToken));
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw error;
        }
    };

    return refreshAccessToken;*/
};

export default useAuthRefresh;
