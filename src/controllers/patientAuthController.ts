import { Request, Response, NextFunction } from "express";
import { authenticatePatient } from "../services/patientAuthLogic.js";

export const loginPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // HTTP-level validation check
    if (!email || !password) {
      res
        .status(400)
        .json({
          success: false,
          message: "Please provide email and password.",
        });
      return;
    }

    // Invoke our clean business service layer
    const authData = await authenticatePatient({ email, password });

    // Respond with uniform layout structure matching the nurse login
    res.status(200).json({
      success: true,
      token: authData.token,
      data: authData.patient,
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
