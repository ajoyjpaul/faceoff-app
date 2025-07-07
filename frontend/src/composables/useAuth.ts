import { ref, computed } from 'vue'
import { authService } from '../services/authService'
import type { AuthResult } from '../types'

export function useAuth() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    if (!email || !password) {
      error.value = 'Please enter both email and password'
      return { success: false, error: error.value }
    }

    error.value = null
    isLoading.value = true

    try {
      const result = await authService.signIn(email, password)
      
      if (result.success) {
        error.value = null
      } else {
        error.value = result.error || 'Authentication failed'
      }
      
      return result
    } catch (err) {
      error.value = 'Network error. Please try again.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    signIn
  }
}