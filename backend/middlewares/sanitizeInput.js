/**
 * Input Sanitization Middleware
 * Prevents NoSQL injection by stripping MongoDB operators from request body,
 * query, and params. Also prevents prototype pollution.
 */

const MONGO_OPERATORS = /^\$|\.|\{|\}/;

/**
 * Recursively sanitize an object by removing keys that start with $
 * or contain dots (MongoDB operator patterns).
 */
const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;

  // Prevent prototype pollution
  if (obj.constructor !== Object && !Array.isArray(obj)) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const sanitized = {};
  for (const key of Object.keys(obj)) {
    // Block keys starting with $ or containing dots
    if (MONGO_OPERATORS.test(key)) continue;

    // Block __proto__, constructor, prototype
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;

    sanitized[key] = sanitizeObject(obj[key]);
  }
  return sanitized;
};

const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params);
  }
  next();
};

export default sanitizeInput;
