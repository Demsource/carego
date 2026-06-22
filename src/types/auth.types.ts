import { INurse } from "../models/Nurse.js";

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
  patient: Record<string, any>; // Will hold the clean patient database document
}
