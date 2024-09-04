const authService = require('../services/authServices')

const signup = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const result = await authService.signup(email, password, name)
        if (result.error) {
            return res.status(result.status).json({ message: result.message })
        }
        return res.status(201).json({ id: result.insertId, message: 'User created successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    try {
        const result = await authService.login(email, password);
        
        if (result.error) {
            return res.status(result.status).json({ message: result.message });
        }
        //store JWT in an httpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });
        
        
        return res.status(200).json({
            message: 'Login successful',
            accessToken: result.accessToken,
            user: result.userResponse,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const refreshToken = async (req, res) => {
    const {refreshToken} = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
    }

    try {
        const result = await authService.refreshToken(refreshToken);
        return res.status(200).json({accessToken: result.accessToken});
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

}

const logout = async (req, res) => {

    // Clear the access token cookie
    res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0), sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    
    // Clear the refresh token cookie
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0), sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });

    res.status(200).json({ message: 'Logged out successfully' });
}

module.exports = { signup, login , refreshToken,logout}