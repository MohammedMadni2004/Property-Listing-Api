import { ParsedQs } from "qs";
import redisClient from "../providers/redis";

const client = redisClient;

export function invalidateCache(cacheKey: string) {
  client.del(cacheKey, (err) => {
    if (err) {
      console.error(`Error invalidating cache for key ${cacheKey}:`, err);
    } else {
      console.log(`Cache invalidated for key ${cacheKey}`);
    }
  });
}
export const normalizeCacheKey = (query: ParsedQs ) => {
    const sortedKeys = Object.keys(query).sort(); // Sort keys for consistent cache keys
    const keyParts = sortedKeys.map((key) => `${key}:${query[key] || "all"}`); // Format key-value pairs
    return `cache:${keyParts.join("|")}`; // Join parts with a delimiter
  };
  

