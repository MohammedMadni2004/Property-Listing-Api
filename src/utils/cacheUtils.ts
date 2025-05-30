import { ParsedQs } from "qs";
import redisClient from "../providers/redis";

const client = redisClient;

export async function invalidateCache(cacheKey: string) {
    try {
      const response = await client.del(cacheKey); // response is a number (0 or 1)
      if (response === 1) {
        console.log(`Cache invalidated for key: ${cacheKey}`);
      } else {
        console.log(`No cache found for key: ${cacheKey}`);
      }
    } catch (err) {
      console.error("Error invalidating cache:", err);
    }
}

export const normalizeCacheKey = (query: ParsedQs ) => {
    const sortedKeys = Object.keys(query).sort(); // Sort keys for consistent cache keys
    const keyParts = sortedKeys.map((key) => `${key}:${query[key] || "all"}`); // Format key-value pairs
    return `cache:${keyParts.join("|")}`; // Join parts with a delimiter
  };
  

