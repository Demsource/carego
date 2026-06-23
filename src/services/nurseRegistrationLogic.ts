import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Nurse, INurse } from "../models/Nurse.js";
import { NurseAuthResponse } from "../types/auth.types.js";
import { calculateAge, calculateExperience } from "../utils/calculations.js";

// Register a new nurse, hash the password, and apply business logic calculations
export const registerNurseAccount = async (
  nurseData: Partial<INurse>,
): Promise<NurseAuthResponse> => {
  if (!nurseData.birthDate) throw new Error("Birth date is required");
  if (!nurseData.passwordHash) throw new Error("Password is required");

  // Calculations
  const calculatedAge = calculateAge(nurseData.birthDate);
  const calculatedExp = nurseData.workExperience
    ? calculateExperience(nurseData.workExperience)
    : { years: 0, months: 0 };

  // Securely hash the plain text password
  const hashedPassword = await bcrypt.hash(nurseData.passwordHash, 10);

  // Build complete schema object with the securely hashed password and with defaults explicit or handled by mongoose
  const newNurse = new Nurse({
    ...nurseData,
    role: "nurse",
    age: calculatedAge,
    yearsOfExperience: calculatedExp,
    passwordHash: hashedPassword,
  });

  await newNurse.save();

  // Convert Mongoose document to a plain object and strip passwordHash using a safe inline cast
  const nurseObject = newNurse.toObject() as INurse;
  delete (nurseObject as any).passwordHash;

  // Generate the token
  const token = jwt.sign(
    { id: nurseObject._id, role: "nurse" },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        "1d") as jwt.SignOptions["expiresIn"],
    },
  );

  return {
    token,
    nurse: nurseObject,
  };
};
