<script setup lang="ts">
import ErrorBoundary from './components/ErrorBoundary.vue'
</script>

<template>
  <ErrorBoundary>
    <router-view class="h-100" />
  </ErrorBoundary>
</template>

<style scoped>
/* App-level styles - currently none needed */
</style>