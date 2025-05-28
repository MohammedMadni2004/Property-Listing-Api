import {Request, Response, NextFunction} from 'express';
import {verifyToken} from '../utils/tokenUtils';

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({error: 'Unauthorized'});
    try {
        verifyToken(token);
        next();
    } catch (error) {
        res.status(401).json({error: 'Invalid token'});
    }
};

export default validateRequest;
