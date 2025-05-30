import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

await redisClient.connect();

export default redisClient;
