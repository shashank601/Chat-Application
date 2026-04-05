import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

import { async_handler } from '../middlewares/async_handler.js';
import { 
    login as login_query, 
    register as register_query 
} from '../db/queries.js'







export const login = async_handler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const err = new Error('email and password are required');
        err.code = 400;
        throw err;
    }

    const result = await pool.query(login_query, [email]); // get hashed pwd to compare

    if (result.rows.length === 0) {
        const err = new Error('invalid credentials');
        err.code = 401;
        throw err;
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.pwd);
    if (!isMatch) {
        const err = new Error('invalid credentials');
        err.code = 401;
        throw err;
    }

    const token = jwt.sign(
        { user_id: user.user_id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ token });
});



export const register = async_handler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const err = new Error('missing required fields');
        err.code = 400;
        throw err;
    }

    const round = 10;
    const hashedpwd = await bcrypt.hash(password, round);
    let result;
    try {
        result = await pool.query(register_query, [name, email, hashedpwd]);
    } catch (err) {
        if (err.code === '23505') {  // unique_violation
            err.code = 409;
            err.message = 'Email already exists';
        }
        throw err;  
    }

    const user = result.rows[0];
    const token = jwt.sign(
        { user_id: user.user_id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ token });
    
    
});


export const verify = (req, res) => {
    res.json({ id: req.user.userId });
}