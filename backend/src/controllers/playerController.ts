import { Request, Response } from "express";
import path from "path";
import { sendResponse } from "../utils/helpers";

export const playerController = {
  // Get all players - requires Firebase authentication
  async getPlayers(req: Request, res: Response) {
    try {
      // Secure path to player data
      const playerDataPath = path.join(
        process.cwd(),
        "shared/data/player_data.json"
      );
      const playerData = require(playerDataPath);

      sendResponse.success(
        res,
        {
          players: playerData,
          requestedBy: req.user?.uid,
        },
        "Player data retrieved successfully"
      );
    } catch (error) {
      sendResponse.error(res, "Failed to load player data", 500);
    }
  },
};