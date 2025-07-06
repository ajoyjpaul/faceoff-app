import { Response } from "express";
import { HTTP_STATUS } from "./constants";

// Response helper functions
export const sendResponse = {
  success: (
    res: Response,
    data: any = null,
    message: string = "Success",
    statusCode: number = HTTP_STATUS.OK
  ) => {
    return res.status(statusCode).json({
      success: true,
      message,
      ...data,
      timestamp: new Date().toISOString(),
    });
  },

  error: (
    res: Response,
    message: string = "Error",
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errors: any = null
  ) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  },
};
