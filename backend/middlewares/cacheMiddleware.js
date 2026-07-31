const cache = new Map();

/**
 * Simple in-memory response cache middleware
 * @param {number} durationInSeconds Cache duration in seconds (default: 60)
 */
export const cacheMiddleware = (durationInSeconds = 60) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse && Date.now() < cachedResponse.expiry) {
      res.setHeader("X-Cache", "HIT");
      return res.status(200).json(cachedResponse.data);
    }

    // Intercept res.json to capture response payload
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Only cache successful 200 responses
      if (res.statusCode === 200) {
        cache.set(key, {
          data: body,
          expiry: Date.now() + durationInSeconds * 1000,
        });
      }
      res.setHeader("X-Cache", "MISS");
      return originalJson(body);
    };

    next();
  };
};

/**
 * Utility to invalidate specific cache keys or clear entire cache
 */
export const clearCache = (keyPrefix = null) => {
  if (!keyPrefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(keyPrefix)) {
      cache.delete(key);
    }
  }
};
