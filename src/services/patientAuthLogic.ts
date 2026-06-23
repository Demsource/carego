import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Patient, IPatient } from "../models/Patient.js";
import { LoginCredentials, PatientAuthResponse } from "../types/auth.types.js";

export const authenticatePatient = async (
  credentials: LoginCredentials,
): Promise<PatientAuthResponse> => {
  const { email, password } = credentials;

  // Find the patient by email
  const patient = await Patient.findOne({ email });
  if (!patient) {
    throw new Error("Invalid credentials");
  }

  // Use bcrypt directly to compare the plaintext password vs the stored passwordHash
  const isMatch = await bcrypt.compare(password, patient.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate JSON Web Token
  const token = jwt.sign(
    { id: patient._id, role: "patient" },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        "1d") as jwt.SignOptions["expiresIn"],
    },
  );

  // Convert Mongoose document to a plain object and strip passwordHash using a safe inline cast
  const patientData = patient.toObject() as IPatient;
  delete (patientData as any).passwordHash;

  return {
    token,
    patient: patientData,
  };
};
