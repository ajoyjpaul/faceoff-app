import { ref, onMounted, onUnmounted, readonly } from "vue";
import { authService } from "../services/authService";
import { useRouter } from "vue-router";

export function useAuth() {
  const user = ref<any>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(true);
  const router = useRouter();

  let intervalId: NodeJS.Timeout | null = null;

  const checkAuthStatus = async () => {
    const hasToken = authService.isAuthenticated();
    if (hasToken) {
      const isValid = await authService.verifyToken();
      isAuthenticated.value = isValid;
      if (isValid) {
        // You can get user info from the token if needed
        user.value = authService.getCurrentUser();
      } else {
        // Token is invalid, sign out
        await authService.signOut();
        user.value = null;
      }
    } else {
      isAuthenticated.value = false;
      user.value = null;
    }
    isLoading.value = false;
  };

  onMounted(async () => {
    // Check initial auth status
    await checkAuthStatus();

    // Set up periodic token validation (every 5 minutes)
    intervalId = setInterval(checkAuthStatus, 5 * 60 * 1000);
  });

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  const signOut = async () => {
    try {
      await authService.signOut();
      user.value = null;
      isAuthenticated.value = false;
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const requireAuth = () => {
    if (!isAuthenticated.value) {
      router.push("/login");
    }
  };

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    signOut,
    requireAuth,
  };
}