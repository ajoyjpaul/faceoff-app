<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
    <i v-if="icon && !loading" :class="icon" class="me-2"></i>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'outline-danger'
  type?: 'button' | 'submit' | 'reset'
  icon?: string
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const classes = ['btn']
  
  // Only the variants you actually use
  if (props.variant === 'primary') {
    classes.push('btn-gold')
  } else {
    classes.push('btn-outline-danger')
  }
  
  // Full width
  if (props.fullWidth) {
    classes.push('w-100')
  }
  
  return classes.join(' ')
})
</script>

<style scoped>
/* Penguins gold primary button */
.btn-gold {
  background-color: var(--color-penguins-gold);
  border-color: var(--color-penguins-gold);
  color: var(--color-text-on-primary);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm) var(--color-penguins-gold-shadow);
  transition: all var(--transition-normal);
}

.btn-gold:hover:not(:disabled) {
  background-color: var(--color-penguins-gold-hover);
  border-color: var(--color-penguins-gold-hover);
  color: var(--color-text-on-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md) var(--color-penguins-gold-shadow-hover);
}

.btn-gold:focus {
  box-shadow: 0 0 0 0.2rem var(--color-penguins-gold-focus);
}

.btn-gold:disabled {
  background-color: var(--color-gray-400);
  border-color: var(--color-gray-400);
  color: var(--color-text-disabled);
  box-shadow: none;
  transform: none;
}

/* Outline danger button */
.btn-outline-danger {
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--shadow-sm) var(--color-danger-shadow);
  transition: all var(--transition-normal);
}

.btn-outline-danger:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md) var(--color-danger-shadow-hover);
}

.btn-outline-danger:focus {
  box-shadow: 0 0 0 0.2rem var(--color-danger-focus);
}
</style>