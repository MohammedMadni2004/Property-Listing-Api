import { Request } from 'express';
import { IUserDocument } from './user';

export interface CustomRequest extends Request {
  user?: IUserDocument; 
}