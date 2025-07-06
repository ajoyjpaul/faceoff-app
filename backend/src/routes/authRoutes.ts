import { Router } from "express";
import { authController } from "../controllers/authController";
import { validateRequest } from "../middleware/validation";

const router = Router();

// POST /api/auth/signin - Sign in with email and password
router.post("/signin", 
  validateRequest({ 
    email: true,
    password: true 
  }), 
  authController.signIn
);

// POST /api/auth/verify - Verify token
router.post("/verify", authController.verifyToken);

export default router;