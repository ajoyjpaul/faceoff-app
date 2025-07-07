import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import { authService } from "../services/authService"

// Lazy load components for better performance
const LoginPage = () => import("../views/LoginPage.vue")
const PlayerComparison = () => import("../views/PlayerComparison.vue")

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: LoginPage },
  {
    path: "/compare",
    name: "PlayerComparison",
    component: PlayerComparison,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard to protect routes
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth) {
    // Check if user is authenticated
    if (authService.isAuthenticated()) {
      // Verify token is still valid
      const isValid = await authService.verifyToken()
      if (isValid) {
        next()
      } else {
        // Token is invalid, clear it and redirect to login
        await authService.signOut()
        next("/login")
      }
    } else {
      // User is not authenticated, redirect to login
      next("/login")
    }
  } else {
    // Route doesn't require authentication
    if (to.path === "/login" && authService.isAuthenticated()) {
      // If user is already logged in and trying to access login, redirect to compare
      next("/compare")
    } else {
      next()
    }
  }
})

export default router