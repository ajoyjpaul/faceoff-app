export interface AuthResult {
  success: boolean;
  error?: string;
  token?: string;
  user?: {
    uid: string;
    email: string;
  };
}

const API_BASE_URL = "http://localhost:3000/api";

export const authService = {
  // Sign in with email and password via backend API
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem("authToken", data.token);
        return data;
      } else {
        return {
          success: false,
          error: data.error || "Username/password error",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  },

  // Get current user from stored token
  getCurrentUser() {
    const token = localStorage.getItem("authToken");
    return token ? { token } : null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return localStorage.getItem("authToken") !== null;
  },

  // Sign out
  async signOut(): Promise<void> {
    localStorage.removeItem("authToken");
  },

  // Verify token with backend
  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      return false;
    }
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem("authToken");
  },
};