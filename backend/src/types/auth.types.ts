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
  };
}