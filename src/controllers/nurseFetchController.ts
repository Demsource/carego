import { Request, Response, NextFunction } from "express";
import { getPopularNurses } from "../services/nurseFetchLogic.js";

export const getPopularNursesList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const nurses = await getPopularNurses();

    res.status(200).json({
      success: true,
      count: nurses.length,
      data: nurses,
    });
  } catch (error) {
    next(error);
  }
};
