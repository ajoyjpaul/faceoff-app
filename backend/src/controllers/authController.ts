import { Request, Response } from "express";
import { signInWithEmailAndPassword } from "firebase/auth";
import { clientAuth, adminAuth } from "../config/firebase";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  token?: string;
  user?: {
    uid: string;
    email: string;
  };
}

export const authController = {
  // Sign in with email and password
  async signIn(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email and password are required",
        } as AuthResponse);
      }

      try {
        // Use Firebase Client SDK to authenticate
        const userCredential = await signInWithEmailAndPassword(
          clientAuth,
          email,
          password
        );

        // Get the ID token
        const token = await userCredential.user.getIdToken();

        return res.json({
          success: true,
          token: token,
          user: {
            uid: userCredential.user.uid,
            email: userCredential.user.email || email,
          },
        } as AuthResponse);
      } catch (error: any) {
        let errorMessage = "Username/password error";

        // Handle specific Firebase auth errors
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
          case "auth/invalid-email":
            errorMessage = "Username/password error";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many failed attempts. Please try again later.";
            break;
          default:
            errorMessage = "Username/password error";
        }

        return res.status(401).json({
          success: false,
          error: errorMessage,
        } as AuthResponse);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      } as AuthResponse);
    }
  },

  // Verify token
  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({
          success: false,
          error: "No token provided",
        });
      }

      const decodedToken = await adminAuth.verifyIdToken(token);

      return res.json({
        success: true,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
        },
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }
  },
};