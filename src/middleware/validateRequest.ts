import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenUtils";
import { UserModel } from "../models/userModel";
import { CustomRequest } from "../types/Request";

async function validateRequest(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decodedId = verifyToken(token);
    const user = await UserModel.findOne({ _id: decodedId });
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export default validateRequest;
