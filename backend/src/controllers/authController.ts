import { Request, Response } from "express";
import { signInWithEmailAndPassword } from "firebase/auth";
import { clientAuth, adminAuth } from "../config/firebase";
import { sendResponse } from "../utils/helpers";
import { LoginRequest, AuthResponse } from "../types";

export const authController = {
  // Sign in with email and password
  async signIn(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        return sendResponse.error(res, "Email and password are required", 400);
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

        return sendResponse.success(res, {
          token: token,
          user: {
            uid: userCredential.user.uid,
          },
        }, "Successfully logged in");
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

        return sendResponse.error(res, errorMessage, 401);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      return sendResponse.error(res, "Internal server error", 500);
    }
  },

  // Verify token
  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return sendResponse.error(res, "No token provided", 401);
      }

      const decodedToken = await adminAuth.verifyIdToken(token);

      return sendResponse.success(res, {
        user: {
          uid: decodedToken.uid,
        },
      }, "Token verified successfully");
    } catch (error) {
      return sendResponse.error(res, "Invalid token", 401);
    }
  },
};