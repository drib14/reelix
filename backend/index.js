// ==============================
// Load Environment Variables
// ==============================

import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: "./backend/.env" });

// ==============================
// Packages
// ==============================

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// ==============================
// Database
// ==============================

import connectDB from "./config/db.js";

// ==============================
// Routes
// ==============================

import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// ==============================
// Connect Database
// ==============================

connectDB();

const app = express();

// ==============================
// CORS
// ==============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".onrender.com")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// ==============================
// Middleware
// ==============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==============================
// Port
// ==============================

const PORT = process.env.PORT || 3000;

// ==============================
// Health Check Endpoint
// ==============================

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Reelix API is live" });
});

// ==============================
// API Routes
// ==============================

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/ai", aiRoutes);

// ==============================
// Static Uploads & Production Client
// ==============================

const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  app.get("*", (req, res, next) => {
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/health") ||
      req.path.startsWith("/uploads")
    ) {
      return next();
    }
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// ==============================
// Start Server
// ==============================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});