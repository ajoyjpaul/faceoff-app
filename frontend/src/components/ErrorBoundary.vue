<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h2 class="error-title">Something went wrong</h2>
      <p class="error-message">{{ errorMessage }}</p>
      <button class="btn btn-gold" @click="retry">
        Try Again
      </button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

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
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
}

.error-container {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
}

.error-icon {
  font-size: 4rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
}

.error-message {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #ccc;
  line-height: 1.5;
}

.btn-gold {
  background-color: #fcb514;
  border: none;
  color: #000;
  font-weight: 600;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-gold:hover {
  background-color: #f39c12;
  transform: translateY(-1px);
}
</style>