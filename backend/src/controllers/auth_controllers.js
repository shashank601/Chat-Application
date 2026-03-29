import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import { async_handler } from '../middlewares/async_handler.js';
import { login_query, register_query } from '../db/queries.js'

export const login = async_handler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const err = new Error('email and password are required');
        err.statusCode = 400;
        throw err;
    }

    const result = await pool.query(login_query, [email]); // get hashed pwd to compare

    if (result.rows.length === 0) {
        const err = new Error('invalid credentials');
        err.statusCode = 401;
        throw err;
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.pwd);
    if (!isMatch) {
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
    }

    const token = jwt.sign(
        { userId: user.user_id }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({ token });
});



export const register = async_handler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const err = new Error('missing required fields');
        err.statusCode = 400;
        throw err;
    }

    const salt = 10;
    const hashedpwd = await bcrypt.hash(password, salt);
    let result;
    try {
        result = await pool.query(register_query, [name, email, hashedpwd]);
    } catch (err) {
        if (err.code === '23505') {  // unique_violation
            err.statusCode = 409;
            err.message = 'Email already exists';
        }
        throw err;  
    }

    const user = result.rows[0];
    const token = jwt.sign(
        { userId: user.user_id }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({ token });
    
    
});
