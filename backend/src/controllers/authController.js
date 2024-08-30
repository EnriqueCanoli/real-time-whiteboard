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
        res.cookie('accessToken', result.token , {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'Strict',
        });
        
        return res.status(200).json({ message: 'Login successful', user:result.userResponse});
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { signup, login }