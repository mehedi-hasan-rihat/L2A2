import bcrypt from 'bcrypt';
import { pool } from '../../config/database';
import jwt from 'jsonwebtoken';
import config from '../../config';

interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'customer' | 'admin';
}

const hashPassword = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};


const createUser = async (payload: CreateUserPayload) => {
    const { name, email, password, phone, role = "customer" } = payload;

    if (!name || !email || !password || !phone || !role) {
        throw new Error('All fields are required');
    }

    if(password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }

    const hashedPassword = await hashPassword(password);

    // Here you would typically insert the user into the database

    const result = await pool.query(`
        INSERT INTO users (name, email, password, phone, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [name, email, hashedPassword, phone, role]);
    
    return {id: result.rows[0].id, name: result.rows[0].name, email: result.rows[0].email, phone: result.rows[0].phone, role: result.rows[0].role  };
};

const signin = async (payload: { email: string; password: string }) => {
    const { email, password } = payload;

    // Signin logic to be implemented

     const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        email,
    ]);

    console.log(userData, "user data in service");

    if (userData.rowCount === 0) {
        throw new Error('User not found');
    }

    const match = await bcrypt.compare(password, userData.rows[0].password);

    if (!match) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { name: userData.rows[0].name, email: userData.rows[0].email, role: userData.rows[0].role },
        config.JWT_SECRET as string,
        {
        expiresIn: "7d",
        }
    );

    return { token, user: {id: userData.rows[0].id, name: userData.rows[0].name, email: userData.rows[0].email, phone: userData.rows[0].phone, role: userData.rows[0].role } };
}
    
export const AuthService = {
    createUser,
    signin
};
