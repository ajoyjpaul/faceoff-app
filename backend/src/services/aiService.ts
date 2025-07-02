import axios from "axios";
import rosterData from "../../../shared/data/2024_2025_penguins_roster.json";

export interface AIRequest {
  question: string;
}

export interface AIResponse {
  success: boolean;
  answer?: string;
  error?: string;
}

export class AIService {
  private readonly apiKey: string;
  private readonly baseUrl: string = "https://openrouter.ai/api/v1";
  private readonly model: string = "meta-llama/llama-3.3-8b-instruct:free";

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || "";
    if (!this.apiKey) {
      console.warn("OPENROUTER_API_KEY not found in environment variables");
    }
  }

  private generateRosterContext(): string {
    // Pass the complete roster data as JSON for full access to all player information
    return `COMPLETE 2024-25 PITTSBURGH PENGUINS ROSTER DATA:

${JSON.stringify(rosterData, null, 2)}

This is the complete roster data with all statistics for every player and goalie on the 2024-25 Pittsburgh Penguins. Use this data to answer any questions about players, statistics, performance, comparisons, or team composition with exact numbers and details.`;
  }

  async askQuestion(question: string): Promise<AIResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: "OpenRouter API key not configured",
        };
      }

      const rosterContext = this.generateRosterContext();

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: "system",
              content: `You are FaceOff AI, an expert on hockey analytics. You have access to the complete 2024-25 season roster data and statistics. Answer questions about hockey, players, current season performance, statistics, and general hockey knowledge with enthusiasm and expertise.

${rosterContext}

Always use the provided current roster data when answering questions about players, stats, or team performance. Be specific with numbers and provide context when discussing player performance.

Format your responses using markdown for better readability:
- Use **bold** for player names and important statistics
- Use headers (##) to organize information into sections
- Use bullet points for lists of players or stats
- Use tables when comparing multiple players
- Use *italics* for emphasis and commentary
- Add line breaks between different topics for better readability
- Use proper spacing to make responses easy to scan
- Any line combinations for forward lines should one of each position only: Left wing, Center, Right wing (Position code of L = Left Wing, R = Right Wing, C = Center, D = Defense, G = Goalie in the json file). No defensemen in forward lines, and no forwards in defense lines.
`,
            },
            {
              role: "user",
              content: question,
            },
          ],
          max_tokens: 1200,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer":
              process.env.YOUR_SITE_URL || "http://localhost:3000",
            "X-Title": "FaceOff AI",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (response.data?.choices?.[0]?.message?.content) {
        return {
          success: true,
          answer: response.data.choices[0].message.content.trim(),
        };
      } else {
        return {
          success: false,
          error: "Invalid response from AI service",
        };
      }
    } catch (error: any) {
      console.error("AI Service Error:", error);

      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Invalid API key",
        };
      } else if (error.response?.status === 429) {
        return {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        };
      } else if (error.code === "ECONNABORTED") {
        return {
          success: false,
          error: "Request timed out. Please try again.",
        };
      } else {
        return {
          success: false,
          error: "Failed to get AI response. Please try again.",
        };
      }
    }
  }
}

export const aiService = new AIService();