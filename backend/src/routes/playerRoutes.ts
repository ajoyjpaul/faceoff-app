import { Router } from "express";
import { playerController } from "../controllers/playerController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// GET /api/players - Get all players (requires auth)
router.get("/", requireAuth, playerController.getPlayers);

export default router;