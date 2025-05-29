import { UserModel } from '../models/userModel';
import bcrypt from 'bcrypt';

type CreateUserInput = { 
  name: string;
  email: string;
  password: string;
}

export async function createUser({ name, email, password }: CreateUserInput) {
  const hashedPassword = await bcrypt.hash(password, 10);
   try{
  const newUser = UserModel.create({
    name,
    email,
    password: hashedPassword,
    });
    return newUser;
 } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('User creation failed');
    }
}

export async function findUserByEmail(email: string) {
  return await UserModel.findOne({ email });
}
