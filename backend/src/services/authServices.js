const bcript = require('bcrypt');
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
        const saltRouds = 10;
        const hashedPassword = await bcript.hash(password, saltRouds)

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
        const isMatch = await bcript.compare(password, user.password_hash)

        if(!isMatch){
            return {error:true, status:401, message:'Invalid credentials'}
        }

        const token = jwt.sign(
            {userId: user.id, email:email},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )

        

        return {error: false, token, userResponse: {"name": user.name, "email": user.email }}

    } catch (error) {
        throw error
    }
}

module.exports = {signup, login}