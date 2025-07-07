<template>
  <div class="stat-item">
    <span class="stat-label">{{ label }}</span>
    <span class="stat-value" :class="{ 'best-stat': isBest }">
      {{ displayValue }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  value: string | number
  isBest?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isBest: false
})

const displayValue = computed(() => {
  return typeof props.value === 'number' ? props.value.toString() : props.value
})
</script>

<style scoped>
/* Uses shared .stat-item styles from components.css */
</style>