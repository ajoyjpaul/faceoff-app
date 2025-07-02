import { Request, Response } from "express";
import { aiService, AIRequest, AIResponse } from "../services/aiService";

export const aiController = {
  // Ask AI a question
  async askQuestion(req: Request, res: Response) {
    try {
      const { question }: AIRequest = req.body;

      if (!question || question.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Question is required",
        } as AIResponse);
      }

      const result = await aiService.askQuestion(question.trim());

      if (result.success) {
        return res.json(result);
      } else {
        return res.status(500).json(result);
      }
    } catch (error) {
      console.error("AI Controller Error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      } as AIResponse);
    }
  },
};