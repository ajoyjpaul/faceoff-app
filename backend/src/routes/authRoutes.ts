import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

// POST /api/auth/signin - Sign in with email and password
router.post("/signin", authController.signIn);

// POST /api/auth/verify - Verify token
router.post("/verify", authController.verifyToken);

export default router;