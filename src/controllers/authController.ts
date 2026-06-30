import { Request, Response, NextFunction } from "express";
import { authenticateUser } from "../services/authLogic.js";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // HTTP-level validation check
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
      return;
    }

    // Execute multi-table authentication context
    const authData = await authenticateUser({ email, password });

    // Respond with clean data
    res.status(200).json({
      success: true,
      token: authData.token,
      data: authData.user, // Includes the profile layout and the implicit role field
    });
  } catch (error: any) {
    // Catch 'Invalid credentials' or database exceptions and pass to error handling middleware
    if (error.message === "Invalid credentials") {
      res.status(401).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};
