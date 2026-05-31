import redis from "../config/redis.js";

export const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Cache GET failed:", err);
    return null; // redis down → fall through to DB, never crash
  }
};

export const setCache = async (key, data, ttl = 60) => {
  try {
    await redis.setEx(key, ttl, JSON.stringify(data));
  } catch (err) {
    console.error("Cache SET failed:", err);
    // don't throw — caching is optional, not critical
  }
};