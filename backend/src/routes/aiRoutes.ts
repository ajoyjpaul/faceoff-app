import { Router } from "express";
import { aiController } from "../controllers/aiController";

const router = Router();

router.post("/ask", aiController.askQuestion);

export default router;