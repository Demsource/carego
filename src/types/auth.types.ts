import { INurse } from "../models/Nurse.js";
import { IPatient } from "../models/Patient.js";

// Shared input credentials structure for Nurse and Patient roles
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface NurseAuthResponse {
  token: string;
  nurse: Omit<INurse, "passwordHash">; // Exclude sensitive password hash from the response
}

export interface PatientAuthResponse {
  token: string;
  patient: IPatient;
}
