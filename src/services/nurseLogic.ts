import bcrypt from "bcryptjs";
import { Nurse, INurse, IWorkExperience } from "../models/Nurse.js";

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
): Promise<Omit<INurse, "passwordHash">> => {
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
    age: calculatedAge,
    yearsOfExperience: calculatedExp,
    passwordHash: hashedPassword,
  });

  await newNurse.save();

  // Convert to object and delete passwordHash before returning to client
  const nurseObject = newNurse.toObject();
  delete (nurseObject as any).passwordHash;

  return nurseObject;
};
