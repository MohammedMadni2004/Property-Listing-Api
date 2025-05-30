import redis from "redis";
import { ParsedQs } from "qs";

const client = redis.createClient();

client.on("error", (err) => {
  console.error("Redis error:", err);
});

export function invalidateCache(cacheKey: string) {
  client.del(cacheKey, (err) => {
    if (err) {
      console.error(`Error invalidating cache for key ${cacheKey}:`, err);
    } else {
      console.log(`Cache invalidated for key ${cacheKey}`);
    }
  });
}

