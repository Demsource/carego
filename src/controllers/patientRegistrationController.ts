import { Request, Response, NextFunction } from "express";
import { registerPatientAccount } from "../services/patientRegistrationLogic.js";

export const registerPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { password, repeatPassword } = req.body;

    if (!password || !repeatPassword) {
      res.status(400).json({
        success: false,
        message: "Password and repeat password are required.",
      });
      return;
    }

    if (password !== repeatPassword) {
      res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });
      return;
    }

    const patientData = {
      ...req.body,
      passwordHash: password, // Map plaintext field to pass forward
    };

    const { token, patient } = await registerPatientAccount(patientData);

    res.status(201).json({
      success: true,
      token,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};
