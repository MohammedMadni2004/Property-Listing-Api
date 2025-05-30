import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const createToken = (userId: string) => {
    return jwt.sign(userId, process.env.JWT_SECRET || 'hello', {expiresIn: '365d'});
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'hello');
};
