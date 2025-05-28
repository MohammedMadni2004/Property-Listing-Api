import mongoose from "mongoose";
import { IUserDocument } from "../types/user";

const userSChema = new mongoose.Schema<IUserDocument>({
    name: { type: String, required: true },
    email : { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export const UserModel = mongoose.model<IUserDocument>('User', userSChema);