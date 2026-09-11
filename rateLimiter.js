function rateLimiter(redisClient, limit = 100, windowSec = 60) {
  return async (req, res, next) => {
    const ip = req.ip || '127.0.0.1';
    const key = atelimit:${ip};
    const current = await redisClient.incr(key);
    if (current === 1) await redisClient.expire(key, windowSec);
    if (current > limit) {
      return res.status(429).json({ error: 'Too Many Requests', retryAfter: windowSec });
    }
    next();
  };
}
module.exports = rateLimiter;
