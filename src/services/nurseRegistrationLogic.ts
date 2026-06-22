import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Nurse, INurse, IWorkExperience } from "../models/Nurse.js";
import { NurseAuthResponse } from "../types/auth.types.js";

/**
 * Calculate age based on birth date string/Date
 */
const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

/**
 * Calculate total years and months of experience by summing job durations
 */
export const calculateExperience = (
  workExperience: IWorkExperience[],
): { years: number; months: number } => {
  let totalMonths = 0;

  workExperience.forEach((job) => {
    const start = new Date(job.startDate);
    const end = job.endDate ? new Date(job.endDate) : new Date();

    // Total months calculation between two dates
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    if (months > 0) totalMonths += months;
  });

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  return {
    years: years >= 0 ? years : 0,
    months: remainingMonths >= 0 ? remainingMonths : 0,
  };
};

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
