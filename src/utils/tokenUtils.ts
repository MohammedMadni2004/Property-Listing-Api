import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const createToken = (userId: string):string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'hello', { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'hello') as JwtPayload;
};
