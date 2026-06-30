import { Request, Response, NextFunction } from "express";
import { registerNurseAccount } from "../services/nurseRegistrationLogic.js";

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

    // Cloudinary places the final hosted web URL in file.path
    const photoUrl = files?.["photo"] ? files["photo"][0].path : "";

    // Extract diploma files metadata
    const diplomasAndCertificatesFiles =
      files?.["diplomas"]?.map((file) => ({
        fileId: file.filename, // This acts as the public_id on Cloudinary
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
    const { token, nurse } = await registerNurseAccount(nurseData);

    res.status(201).json({
      success: true,
      token,
      data: nurse,
    });
  } catch (error: any) {
    // Intercept specific custom duplication messages and handle them cleanly
    if (
      error instanceof Error &&
      error.message.includes("already registered")
    ) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};
