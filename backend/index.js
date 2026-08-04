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
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import mongoose from "mongoose";

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
// Security Headers (#5)
// ==============================

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://image.tmdb.org",
          "https://*.tmdb.org",
        ],
        mediaSrc: ["'self'", "blob:", "https://commondatastorage.googleapis.com"],
        frameSrc: [
          "'self'",
          "https://www.youtube.com",
          "https://www.youtube-nocookie.com",
          "https://player.vimeo.com",
          "https://*.2embed.cc",
          "https://*.vidsrc.me",
          "https://*.vidsrc.to",
          "https://*.vidsrc.xyz",
          "https://*.embedsu.com",
          "https://*.autoembed.cc",
          "https://*.vidlink.pro",
          "https://*.2anime.xyz",
          "https://*.vidfast.pro",
          "https://*.multiembed.mov",
        ],
        connectSrc: ["'self'", "https://api.openai.com", "https://api.themoviedb.org"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
  })
);

// ==============================
// Compression (#35)
// ==============================

app.use(compression());

// ==============================
// CORS — Fixed (#3)
// ==============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

// ==============================
// Rate Limiting (#4)
// ==============================

// General API rate limit: 100 requests per minute
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

// Strict auth rate limit: 10 requests per minute
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many authentication attempts, please try again later." },
});

// AI rate limit: 15 requests per minute
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "AI rate limit exceeded. Please wait a moment." },
});

// Apply general limiter to all API routes
app.use("/api/", generalLimiter);

// ==============================
// Middleware
// ==============================

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ==============================
// Input Sanitization (NoSQL Injection Prevention)
// ==============================

import sanitizeInput from "./middlewares/sanitizeInput.js";
app.use(sanitizeInput);

// ==============================
// Port
// ==============================

const PORT = process.env.PORT || 3000;

// ==============================
// Health Check Endpoint (#37)
// ==============================

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "disconnected";

  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? "ok" : "degraded",
    message: "Reelix API",
    database: dbStatus,
    uptime: Math.floor(process.uptime()),
  });
});

// ==============================
// Search Engine SEO Routes (Googlebot / Bingbot / DuckDuckBot)
// ==============================

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *\nAllow: /\nSitemap: ${req.protocol}://${req.get("host")}/sitemap.xml\n`);
});

app.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const date = new Date().toISOString().split("T")[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/movies</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/profile</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Error generating sitemap");
  }
});

// ==============================
// API Routes (with rate limiters)
// ==============================

app.use("/api/v1/users", authLimiter, userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/ai", aiLimiter, aiRoutes);

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

// 404 Handler for undefined API endpoints
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// ==============================
// Global Error Handler (#14)
// ==============================

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Server error" : err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// ==============================
// Start Server
// ==============================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});