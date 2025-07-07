<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h2 class="error-title">Something went wrong</h2>
      <p class="error-message">{{ errorMessage }}</p>
      <BaseButton variant="primary" @click="retry">
        Try Again
      </BaseButton>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import BaseButton from './BaseButton.vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((error: Error) => {
  hasError.value = true
  errorMessage.value = error.message || 'An unexpected error occurred'
  
  // Log error for debugging
  console.error('Error caught by boundary:', error)
  
  // Return false to prevent the error from propagating further
  return false
})

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  
  // Reload the page to reset the component state
  window.location.reload()
}
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
  color: var(--color-text-primary);
}

.error-container {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
}

.error-icon {
  font-size: 4rem;
  color: var(--color-danger);
  margin-bottom: 1rem;
}

.error-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
}

.error-message {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

</style>