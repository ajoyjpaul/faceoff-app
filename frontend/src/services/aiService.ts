const API_BASE_URL = "http://localhost:3000/api";

export interface AIResponse {
  success: boolean;
  answer?: string;
  error?: string;
}

export const aiService = {
  // Ask AI a question
  async askQuestion(question: string): Promise<AIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("AI Service Error:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  },
};