import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Patient, IPatient } from "../models/Patient.js";
import { calculateAge } from "../utils/calculations.js";
import { PatientAuthResponse } from "../types/auth.types.js";

export const registerPatientAccount = async (
  patientData: Partial<IPatient>,
): Promise<PatientAuthResponse> => {
  if (!patientData.birthDate) throw new Error("Birth date is required");
  if (!patientData.passwordHash) throw new Error("Password is required");

  const calculatedAge = calculateAge(patientData.birthDate);
  const hashedPassword = await bcrypt.hash(patientData.passwordHash, 10);

  // Initialize standard medical service slots matching patient template defaults[cite: 1]
  const targetServices = [
    "injection",
    "infusion",
    "bloodDraw",
    "woundCare",
    "postoperativeCare",
    "elderlyCare",
    "expressTests",
    "probingAndCatheterization",
    "24HourCare",
    "respiratoryTherapy",
  ].map((service) => ({
    serviceName: service,
    serviceCount: 0,
    nurseName: "",
  }));

  const newPatient = new Patient({
    ...patientData,
    role: "patient",
    age: calculatedAge,
    passwordHash: hashedPassword,
    servicesReceived: targetServices,
  });

  await newPatient.save();

  const patientObject = newPatient.toObject() as IPatient;
  delete (patientObject as any).passwordHash;

  const token = jwt.sign(
    { id: patientObject._id, role: "patient" },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        "1d") as jwt.SignOptions["expiresIn"],
    },
  );

  return {
    token,
    patient: patientObject,
  };
};
