import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance";
import { logout } from "../../contexts/auth/authSlice";


const LogoutButton: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    )  

}

export default LogoutButton;