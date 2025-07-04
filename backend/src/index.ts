import express, { Request, Response } from "express";
import { http } from "@google-cloud/functions-framework";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req: Request, res: Response) => {
  res.send("GCF backend is healthy!");
});

app.use("/api/auth", authRoutes);

// Export the app as a Google Cloud Function (temp)
http("faceoffApi", app);
