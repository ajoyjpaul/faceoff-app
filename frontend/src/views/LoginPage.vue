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
            class="form-control form-input"
            placeholder="Email"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="mb-4">
          <input
            v-model="password"
            type="password"
            class="form-control form-input"
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


<style scoped>
.login-container {
  background-color: var(--color-bg-primary);
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
  background-color: var(--color-bg-secondary);
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
  color: var(--color-text-primary);
}

@media (max-width: 576px) {
  .login-form {
    padding: 30px 20px;
    margin: 0 10px;
  }
}
</style>