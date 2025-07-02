<template>
  <div class="faceoff-ai-page overflow-auto">
    <!-- Back Button -->
    <button class="back-button" @click="goBack">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 12H5M12 19L5 12L12 5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Back to Home
    </button>

    <div class="container-fluid h-100">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-12 col-lg-10 col-xl-8">
          <!-- Hockey Logo -->
          <div class="text-center mb-4">
            <img
              src="/penguins.svg"
              alt="Pittsburgh Penguins"
              class="penguins-logo"
            />
          </div>

          <!-- Title -->
          <div class="text-center mb-5">
            <h1 class="page-title">Ask FaceOff AI</h1>
          </div>

          <!-- Question Box Component -->
          <QuestionBox
            @submit="handleQuestionSubmit"
            :placeholder="'Ask about hockey and NHL stats...'"
            :isLoading="isLoading"
          />

          <!-- AI Response Section -->
          <div v-if="showResponse" class="ai-response-section text-center">
            <div class="response-header mb-3">
              <h6 class="response-label">FACEOFF AI RESPONSE</h6>
            </div>
            <div class="response-content">
              <div v-if="isLoading" class="loading-container">
                <div class="typing-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p class="response-text">{{ aiResponse }}</p>
              </div>
              <div v-else class="response-text markdown-content" v-html="parsedResponse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { marked } from "marked";
import QuestionBox from "../components/QuestionBox.vue";
import { aiService } from "../services/aiService";

// Router instance
const router = useRouter();

// Reactive data
const showResponse = ref(false);
const aiResponse = ref("");
const isLoading = ref(false);

// Configure marked options for better formatting
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // Enable GitHub Flavored Markdown
  sanitize: false, // Allow HTML for better formatting
  smartypants: true, // Use smart quotes and other typographic niceness
});

// Computed property to parse markdown
const parsedResponse = computed(() => {
  if (!aiResponse.value || isLoading.value) return "";
  return marked(aiResponse.value);
});

// Methods
const handleQuestionSubmit = async (question) => {
  console.log("Question submitted:", question);

  // Set loading state
  isLoading.value = true;
  showResponse.value = true;
  aiResponse.value = "Thinking...";

  try {
    // Call the AI service
    const result = await aiService.askQuestion(question);

    if (result.success && result.answer) {
      aiResponse.value = result.answer;
    } else {
      aiResponse.value =
        result.error ||
        "Sorry, I couldn't process your question. Please try again.";
    }
  } catch (error) {
    console.error("Error asking question:", error);
    aiResponse.value = "Sorry, something went wrong. Please try again.";
  } finally {
    // Clear loading state
    isLoading.value = false;
  }
};

const goBack = () => {
  router.push("/home");
};
</script>

<style scoped>
.faceoff-ai-page {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
  padding: 20px 0;
  position: relative;
}

.back-button {
  position: fixed;
  top: 30px;
  left: 30px;
  background: rgba(42, 42, 42, 0.9);
  border: 1px solid rgba(64, 64, 64, 0.5);
  color: #e5e7eb;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(52, 52, 52, 0.95);
  border-color: rgba(252, 181, 20, 0.5);
  color: #fcb514;
  transform: translateY(-1px);
}

.back-button svg {
  width: 18px;
  height: 18px;
}

.hockey-logo {
  height: 200px;
  width: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.page-title {
  font-size: 3rem;
  font-weight: 400;
  color: #e5e7eb;
  margin: 0;
  letter-spacing: -0.025em;
}

.ai-response-section {
  margin-top: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.response-header {
  margin-bottom: 20px;
}

.response-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
}

.response-content {
  background: rgba(42, 42, 42, 0.6);
  border-radius: 12px;
  padding: 30px;
  border: 1px solid rgba(64, 64, 64, 0.3);
}

.response-text {
  font-size: 1.5rem;
  line-height: 1.6;
  color: #ffffff;
  margin: 0;
  font-weight: 300;
  text-align: left;
}

/* Markdown content styling */
.markdown-content {
  white-space: pre-wrap; /* Preserve whitespace and line breaks */
  word-wrap: break-word; /* Break long words if necessary */
}

.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6 {
  color: #fcb514;
  margin: 1.5rem 0 1rem 0;
  font-weight: 600;
  line-height: 1.3;
}

.markdown-content h1 {
  font-size: 2rem;
  border-bottom: 2px solid #fcb514;
  padding-bottom: 0.5rem;
}

.markdown-content h2 {
  font-size: 1.75rem;
}

.markdown-content h3 {
  font-size: 1.5rem;
}

.markdown-content h4 {
  font-size: 1.25rem;
}

.markdown-content p {
  margin: 1rem 0;
  line-height: 1.6;
  white-space: pre-wrap;
}

.markdown-content br {
  line-height: 1.8;
}

.markdown-content ul, .markdown-content ol {
  margin: 1rem 0;
  padding-left: 2rem;
}

.markdown-content li {
  margin: 0.5rem 0;
  line-height: 1.5;
}

.markdown-content strong {
  color: #fcb514;
  font-weight: 600;
}

.markdown-content em {
  color: #e5e7eb;
  font-style: italic;
}

.markdown-content code {
  background: rgba(252, 181, 20, 0.1);
  color: #fcb514;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-content pre {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(252, 181, 20, 0.3);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.markdown-content pre code {
  background: none;
  padding: 0;
  color: #ffffff;
}

.markdown-content blockquote {
  border-left: 4px solid #fcb514;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #e5e7eb;
}

.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.markdown-content th, .markdown-content td {
  border: 1px solid rgba(252, 181, 20, 0.3);
  padding: 0.75rem;
  text-align: left;
}

.markdown-content th {
  background: rgba(252, 181, 20, 0.1);
  color: #fcb514;
  font-weight: 600;
}

.markdown-content hr {
  border: none;
  border-top: 1px solid rgba(252, 181, 20, 0.3);
  margin: 2rem 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.typing-animation {
  display: flex;
  gap: 4px;
  margin-bottom: 10px;
}

.typing-animation span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #fcb514;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-animation span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-animation span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hockey-logo {
    height: 150px;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .response-text {
    font-size: 1.25rem;
  }
}

@media (max-width: 576px) {
  .hockey-logo {
    height: 120px;
  }

  .page-title {
    font-size: 2rem;
  }

  .response-text {
    font-size: 1.1rem;
  }

  .response-content {
    padding: 20px;
  }

  .back-button {
    top: 20px;
    left: 20px;
    padding: 10px 16px;
    font-size: 0.9rem;
  }

  .back-button svg {
    width: 16px;
    height: 16px;
  }
}
</style>