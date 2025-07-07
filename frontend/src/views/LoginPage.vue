<template>
  <div class="login-container d-flex align-items-center justify-content-center">
    <div class="login-form rounded-3 shadow">
      <div class="text-center mb-4">
        <div class="login-icon mb-3">
          <img src="/penguins.svg" alt="Pittsburgh Penguins" />
        </div>
        <h2 class="login-title text-white mb-4">Welcome to FaceOff</h2>
      </div>
      
      <form @submit.prevent="login">
        <div class="mb-3">
          <input
            v-model="email"
            type="email"
            class="form-control login-input"
            placeholder="Email"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="mb-4">
          <input
            v-model="password"
            type="password"
            class="form-control login-input"
            placeholder="Password"
            required
            :disabled="isLoading"
          />
        </div>

        <div v-if="error" class="alert alert-danger mb-3" role="alert">
          {{ error }}
        </div>

        <BaseButton 
          type="submit" 
          variant="primary" 
          :loading="isLoading" 
          fullWidth 
          class="mb-3"
        >
          {{ isLoading ? 'Signing in...' : 'Sign in' }}
        </BaseButton>
        
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()
const email = ref('')
const password = ref('')

const { isLoading, error, signIn } = useAuth()

async function login() {
  const result = await signIn(email.value, password.value)
  
  if (result.success) {
    router.push('/compare')
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
}
</style>

<style scoped>
.login-container {
  background-color: #000000;
  height: 100vh;
  width: 100vw;
  padding: 20px;
  box-sizing: border-box;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
}

.login-form {
  background-color: #1a1a1a;
  padding: 40px 30px;
  width: 100%;
  max-width: 400px;
}

.login-icon {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.login-title {
  font-size: 1.8rem;
  font-weight: 400;
  margin: 0;
}

.login-input {
  background-color: #2a2a2a !important;
  border: 1px solid #404040 !important;
  color: #ffffff !important;
  padding: 15px 16px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.login-input:focus {
  background-color: #2a2a2a !important;
  border-color: #FFB81C !important;
  box-shadow: 0 0 0 0.2rem rgba(255, 215, 0, 0.25) !important;
  color: #ffffff !important;
  outline: none;
}

.login-input::placeholder {
  color: #999999;
}


.alert-danger {
  background-color: #dc3545;
  border: 1px solid #dc3545;
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.login-input:disabled {
  background-color: #1a1a1a !important;
  border-color: #2a2a2a !important;
  color: #666666 !important;
  cursor: not-allowed;
}

@media (max-width: 576px) {
  .login-form {
    padding: 30px 20px;
    margin: 0 10px;
  }
}
</style>