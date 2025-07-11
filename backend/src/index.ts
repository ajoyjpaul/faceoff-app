import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import * as admin from "firebase-admin";

// Import custom middleware
import { requestLogger } from "./middleware/logger";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/auth";

// Import routes
import authRoutes from "./routes/authRoutes";
import playerRoutes from "./routes/playerRoutes";

// Import utilities
import { sendResponse } from "./utils/helpers";
import { APP_CONFIG, RATE_LIMITS } from "./utils/constants";

dotenv.config();

// Firebase Admin is initialized in config/firebase.ts

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://faceoff-app-five.vercel.app",
      "https://faceoff-app.vercel.app",
    ],
    credentials: true,
  })
);

// Rate limiting middleware
app.use(
  rateLimiter(RATE_LIMITS.GENERAL.MAX_REQUESTS, RATE_LIMITS.GENERAL.WINDOW_MS)
);

// Logging middleware
app.use(requestLogger);

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  sendResponse.success(
    res,
    {
      service: APP_CONFIG.APP_NAME,
      version: APP_CONFIG.API_VERSION,
      environment: APP_CONFIG.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    "Service is healthy"
  );
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);

// Handle 404 routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Export the Express app for Vercel
export default app;
