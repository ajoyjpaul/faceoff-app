export interface AuthResult {
  success: boolean
  error?: string
  token?: string
  user?: {
    uid: string
    email: string
  }
}

export interface User {
  uid: string
  email: string
  token?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}