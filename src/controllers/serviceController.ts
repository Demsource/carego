import type { NextFunction, Request, Response } from "express";
import { fetchAndFormatServices } from "../services/serviceLogic.js";

// Route handler to get all formatted service names.
export const getAllServices = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Delegate database logic to the service layer
    const formattedServices = await fetchAndFormatServices();
    res.status(200).json(formattedServices);
  } catch (error) {
    // Pass control directly to the global error handler
    next(error);
  }
};
