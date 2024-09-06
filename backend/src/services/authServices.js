const bcrypt = require('bcrypt');
const db = require('../config/db')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signup = async (email, password, name) => {
    try {
        //the result of promise() typically is an array, ex. and we destrucuting the fistElement { id: 1, email: 'example@example.com', name: 'John Doe' },
        const [existingUser] = await db.promise().query('SELECT * from users where email = ? ', [email] )

        if(existingUser.length > 0){
            return {error: true, status:409, message: 'User already exists'}
        }

        //hash the password
        const saltRouds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRouds)

        //insert the new user into the database
        const [result] = await db.promise().query('INSERT INTO users (email, password_hash, name) values (?,?,?)', [email, hashedPassword, name]);

        //retruns and object indication sucess
        return { error: false, insertId: result.insertId };
    } catch (error) {
        throw error;
    }
}


const login = async (email,password) => {
    try {
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ? ', [email]);
        const user = users[0]

        if(!user){
            return {error:true, status:404, message:'User not found'}
        }

        //compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash)

        if(!isMatch){
            return {error:true, status:401, message:'Invalid credentials'}
        }


        const accessToken = jwt.sign(
            { userId: user.id, email: email },
            process.env.JWT_SECRET,
            { expiresIn: '1m' }
        );
        
        const refreshToken = jwt.sign(
            { userId: user.id, email: email },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '5m' }
        );
        

        // Example column update
        await db.promise().query('UPDATE users SET refreshToken = ? WHERE id = ?', [refreshToken, user.id]);


        return {error: false, accessToken, refreshToken, userResponse: {"name": user.name, "email": user.email }}

    } catch (error) {
        console.error('Login route error:', error); 
        throw error
    }
}

const refreshToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        // Fetch stored token from database
        //console.log("[decoded.userId] ", [decoded.userId])
        const [rows] = await db.promise().query('SELECT refreshToken FROM users WHERE id = ?', [decoded.userId]);
        const storedToken = rows[0]?.refreshToken;
        //console.log("storedToken", storedToken)
        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        
        const accessToken = jwt.sign({ userId: decoded.userId, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '1m' });
        
        return { accessToken:accessToken };
    } catch (error) {
        throw error
    }

}

module.exports = {signup, login,refreshToken}


