<template>
  <div class="question-box-container mb-5">
    <div class="search-wrapper position-relative">
      <input
        type="text"
        class="form-control search-input"
        :placeholder="placeholder"
        v-model="question"
        @keyup.enter="handleSubmit"
        :disabled="isLoading"
      />
      <button
        class="btn search-btn position-absolute"
        @click="handleSubmit"
        type="button"
        :disabled="isLoading"
      >
        <span
          v-if="isLoading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="bi bi-arrow-right"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Props
const props = defineProps({
  placeholder: {
    type: String,
    default: "",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["submit"]);

// Reactive data
const question = ref("");

// Methods
const handleSubmit = () => {
  if (question.value.trim()) {
    emit("submit", question.value.trim());
  }
};
</script>

<style scoped>
.question-box-container {
  max-width: 800px;
  margin: 0 auto;
}

.search-wrapper {
  width: 100%;
}

.search-input {
  background-color: #2a2a2a;
  border: 2px solid #404040;
  border-radius: 12px;
  padding: 18px 60px 18px 24px;
  font-size: 16px;
  color: #ffffff;
  transition: all 0.3s ease;
}

.search-input:focus {
  background-color: #2a2a2a;
  border-color: #fcb900;
  box-shadow: 0 0 0 0.2rem rgba(252, 185, 0, 0.25);
  color: #ffffff;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-btn {
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #9ca3af;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.search-btn:hover {
  color: #fcb900;
  background: rgba(252, 185, 0, 0.1);
}

.search-btn:focus {
  box-shadow: none;
  color: #fcb900;
}

.search-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-btn:disabled:hover {
  color: #9ca3af;
  background: transparent;
}
</style>