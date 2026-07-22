// ==============================
// Load Environment Variables
// ==============================

import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

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

app.use(
  cors({
    origin: "http://localhost:5173",
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
// API Routes
// ==============================

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/ai", aiRoutes);

// ==============================
// Static Uploads
// ==============================

const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// Start Server
// ==============================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});