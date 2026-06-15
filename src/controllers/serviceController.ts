import type { NextFunction, Request, Response } from "express";
import {
  fetchAndFormatServices,
  fetchServiceNamesOnly,
} from "../services/serviceLogic.js";

// Route handler to get all formatted service objects array
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

// Route handler to get all formatted service names array
export const getServiceNamesOnly = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const names = await fetchServiceNamesOnly();

    res.status(200).json(names);
  } catch (error) {
    next(error);
  }
};
