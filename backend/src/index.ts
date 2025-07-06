import express, { Request, Response } from "express";
import { http } from "@google-cloud/functions-framework";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import * as admin from "firebase-admin";

// Import custom middleware
import { requestLogger } from "./middleware/logger";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { rateLimiter, requireAuth } from "./middleware/auth";

// Import routes
import authRoutes from "./routes/authRoutes";

// Import utilities
import { sendResponse } from "./utils/helpers";
import { APP_CONFIG, RATE_LIMITS } from "./utils/constants";

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const app = express();

// Security middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
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

// Protected endpoint - requires Firebase authentication
app.get("/api/players", requireAuth, (req: Request, res: Response) => {
  try {
    // Load player data from shared folder
    const playerDataPath = path.join(
      __dirname,
      "../shared/data/player_data.json"
    );
    const playerData = require(playerDataPath);

    sendResponse.success(
      res,
      {
        players: playerData,
        requestedBy: req.user?.uid,
      },
      "Player data retrieved successfully"
    );
  } catch (error) {
    sendResponse.error(res, "Failed to load player data", 500);
  }
});

// API routes
app.use("/api/auth", authRoutes);

// Handle 404 routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Export the app as a Google Cloud Function
http("faceoffApi", app);
