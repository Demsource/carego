import { Request, Response, NextFunction } from "express";
import { registerNurseAccount } from "../services/nurseLogic.js";

export const registerNurse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { password, repeatPassword } = req.body;

    // Validate that both password fields match
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
      return; // Stop execution here so no files or database records are processed
    }

    // Process files if passwords match
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Extract photo details
    const photoUrl = files?.["photo"]
      ? `/uploads/photos/${files["photo"][0].filename}`
      : "";

    // Extract diploma files metadata
    const diplomasAndCertificatesFiles =
      files?.["diplomas"]?.map((file) => ({
        fileId: file.filename,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        uploadDate: new Date(),
      })) || [];

    // Form fields in multipart/form-data arrive as strings
    // We must parse JSON arrays/objects if they are stringified by the front-end
    // Parse incoming stringified arrays from multi-part form data
    const workExperience = req.body.workExperience
      ? JSON.parse(req.body.workExperience)
      : [];
    const specialization = req.body.specialization
      ? JSON.parse(req.body.specialization)
      : [];
    const manipulations = req.body.manipulations
      ? JSON.parse(req.body.manipulations)
      : [];

    const nurseData = {
      ...req.body,
      photoUrl,
      workExperience,
      specialization,
      manipulations,
      diplomasAndCertificatesFiles,
      passwordHash: password, // Passing the validated password forward and Temporarily mapping plain password to passwordHash field
    };

    // Send to Service layer
    const registeredNurse = await registerNurseAccount(nurseData);
    

    res.status(201).json(registeredNurse);
  } catch (error) {
    next(error);
  }
};
