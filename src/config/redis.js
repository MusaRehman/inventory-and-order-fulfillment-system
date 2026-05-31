import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("Redis: too many retries, giving up");
        return new Error("Redis connection failed");
      }
      return Math.min(retries * 100, 3000); // wait 100ms, 200ms, 300ms... max 3s
    },
  },
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));
redis.on("reconnecting", () => console.log("Redis reconnecting..."));

await redis.connect();

export default redis;