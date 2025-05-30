import { signupSchema, loginSchema } from '../schemas/authSchemas';
import { createToken } from '../utils/tokenUtils';
import { createUser, findUserByEmail } from '../services/authServices';
import { IUserDocument } from '../types/user';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export const signupController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = signupSchema.parse(req.body);
    
    const existingUser = await findUserByEmail(email);
    
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }
    
    const user: IUserDocument | null = await createUser({ email, password, name });
    
    if (!user) {
      res.status(500).json({ message: 'Error creating user' });
      return;
    }
    
    const token = createToken(user._id.toString());
    res.status(201).json({ message: 'Signup successful', token, user });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user: IUserDocument | null = await findUserByEmail(email);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const token = createToken(user._id.toString());
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};