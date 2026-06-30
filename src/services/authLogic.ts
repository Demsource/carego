import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Nurse, INurse } from "../models/Nurse.js";
import { Patient, IPatient } from "../models/Patient.js";
import { LoginCredentials } from "../types/auth.types.js";

export interface UnifiedAuthResponse {
  token: string;
  user: INurse | IPatient;
}

export const authenticateUser = async (
  credentials: Required<LoginCredentials>,
): Promise<UnifiedAuthResponse> => {
  const { email, password } = credentials;

  let userDocument: any = null;
  let role: "nurse" | "patient";

  // Try finding a Nurse first (explicitly select password if hidden by schema)
  userDocument = await Nurse.findOne({ email }).select("+passwordHash");

  if (!userDocument) {
    // Fallback to checking the Patient collection
    userDocument = await Patient.findOne({ email }).select("+passwordHash");
    role = "patient";
  } else {
    // Explicitly set the role here so TypeScript knows it's guaranteed to be defined
    role = "nurse";
  }

  // If it doesn't exist in either table, fail out immediately
  if (!userDocument) {
    throw new Error("Invalid credentials");
  }

  // Verify password against the found user type
  // Use bcrypt directly to compare the plaintext password vs the stored passwordHash
  const isMatch = await bcrypt.compare(password, userDocument.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Sign JWT with the dynamically determined role
  // Explicitly type cast options object as jwt.SignOptions
  // and assert that JWT_SECRET is definitely a string
  const token = jwt.sign(
    { id: userDocument._id, role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        "1d") as jwt.SignOptions["expiresIn"],
    },
  );

  // Convert Mongoose document to a plain object and strip passwordHash using a safe inline cast
  // to prevent leaking the security credentials while adhering to the strict INurse | IPatient return interface
  const userData = userDocument.toObject() as INurse | IPatient;
  delete (userData as any).passwordHash;

  return {
    token,
    user: userData,
  };
};
