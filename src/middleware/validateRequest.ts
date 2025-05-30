import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenUtils";
import { UserModel } from "../models/userModel";
import { CustomRequest } from "../types/request";

async function validateRequest(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const headers = req.headers.authorization;
  
  if (!headers || !headers.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = headers.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    const user = await UserModel.findOne({ _id: decoded.userId });

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}

export default validateRequest;
