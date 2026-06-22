import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { INurse, Nurse } from "../models/Nurse.js";
import { LoginCredentials, NurseAuthResponse } from "../types/auth.types.js";

export const authenticateNurse = async (
  credentials: Required<LoginCredentials>,
): Promise<NurseAuthResponse> => {
  const { email, password } = credentials;

  // Explicitly select password field since mongoose hides it by default
  const nurse = await Nurse.findOne({ email }).select("+password");
  if (!nurse) {
    throw new Error("Invalid credentials");
  }

  // Fix: Use bcrypt directly here to compare the plaintext password vs the stored hash
  const isMatch = await bcrypt.compare(password, nurse.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Explicitly type cast options object as jwt.SignOptions
  // and assert that JWT_SECRET is definitely a string
  const token = jwt.sign(
    { id: nurse._id, role: "nurse" },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        "1d") as jwt.SignOptions["expiresIn"],
    },
  );

  // Convert Mongoose document to a plain object and strip passwordHash using a safe inline cast
  // to prevent leaking the security credentials while adhering to the strict INurse return interface
  const nurseData = nurse.toObject() as INurse;
  delete (nurseData as any).passwordHash;

  return {
    token,
    nurse: nurseData,
  };
};
