import redis from "redis";
import { Request, Response, NextFunction } from "express";
import { ParsedQs } from "qs";

const client = redis.createClient();

client.on("error", (err) => {
  console.error("Redis error:", err);
});

export const normalizeCacheKey = (query: ParsedQs ) => {
  const sortedKeys = Object.keys(query).sort(); // Sort keys for consistent cache keys
  const keyParts = sortedKeys.map((key) => `${key}:${query[key] || "all"}`); // Format key-value pairs
  return `cache:${keyParts.join("|")}`; // Join parts with a delimiter
};

const checkCache = (req: Request, res: Response, next: NextFunction) => {
  const cacheKey = normalizeCacheKey(req.query); // Use normalized cache key

  client.get(cacheKey, (err, data) => {
    if (err) {
      console.error("Redis get error:", err);
      return next();
    }

    if (data) {
      return res.status(200).json(JSON.parse(data)); // Return cached data
    }

    next();
  });
};

export default checkCache;
