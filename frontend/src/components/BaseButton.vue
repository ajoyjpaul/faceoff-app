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
.btn-gold {
  background-color: #fcb514;
  border-color: #fcb514;
  color: #000000;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(252, 181, 20, 0.3);
  transition: all 0.3s ease;
}

.btn-gold:hover:not(:disabled) {
  background-color: #f39c12;
  border-color: #f39c12;
  color: #000000;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(252, 181, 20, 0.4);
}

.btn-gold:focus {
  background-color: #fcb514;
  border-color: #fcb514;
  color: #000000;
  box-shadow: 0 0 0 0.2rem rgba(252, 181, 20, 0.5);
}

.btn-gold:disabled {
  background-color: #cccccc;
  border-color: #cccccc;
  color: #666666;
  box-shadow: none;
  transform: none;
}

/* Enhanced Bootstrap outline-danger */
.btn-outline-danger {
  border-radius: 6px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
  transition: all 0.3s ease;
}

.btn-outline-danger:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.btn-outline-danger:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);
}
</style>