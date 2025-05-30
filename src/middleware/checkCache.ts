import { Request, Response, NextFunction } from "express";
import redisClient from "../providers/redis";
import { normalizeCacheKey } from "../utils/cacheUtils";

const checkCache = async (req: Request, res: Response, next: NextFunction) => {
  const cacheKey = normalizeCacheKey(req.query);

  try {
    const data = await redisClient.get(cacheKey);
    if (data) {
      return res.status(200).json(JSON.parse(data));
    }
    next();
  } catch (err) {
    console.error("Redis get error:", err);
    next(); 
  }
};

export default checkCache;
