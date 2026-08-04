import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

// Check if the user is authenticated or not
const authenticate = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.jwt;

  if (token) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is missing.");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized, token failed." });
    }
  } else {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
});

// Check if the user is admin or not
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
  }
};

export { authenticate, authorizeAdmin };
