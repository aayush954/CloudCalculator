// ============================================================
// server.js — Entry point for Multi-Cloud Cost Calculator API
// ============================================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./utils/db");

const calculationRoutes = require("./routes/calculations");
const providerRoutes = require("./routes/providers");
const historyRoutes = require("./routes/history");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ───────────────────────────────────────
connectDB();

// ─── Rate Limiting ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Middleware ───────────────────────────────────────────────
const allowedOrigin = process.env.CORS_ORIGIN || "*";
// Clean up origin URL to prevent trailing slash mismatches
const finalOrigin = (allowedOrigin.endsWith('/') && allowedOrigin !== "*") 
  ? allowedOrigin.slice(0, -1) 
  : allowedOrigin;

app.use(cors({
  origin: finalOrigin,
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/api", limiter);

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/calculate", calculationRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/history", historyRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── Root ─────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "Multi-Cloud Cost Calculator API",
    version: "1.0.0",
    docs: "/api/health",
  });
});

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Health: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
