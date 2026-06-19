import { Schema, model, Document } from "mongoose";

// Sub-interfaces
export interface IWorkExperience {
  employer: string;
  position: string;
  startDate: Date;
  endDate: Date | null; // null represents a current job
}

interface IRating {
  patientName: string;
  rating: number;
  comment: string;
}

interface IDiplomaFile {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
}

// Main Nurse Interface
export interface INurse extends Document {
  firstname: string;
  lastname: string;
  birthDate: Date;
  age: number;
  email: string;
  passwordHash: string;
  mobile: string;
  address: string;
  governmentId: string;
  photoUrl: string;
  yearsOfExperience: number;
  workExperience: IWorkExperience[];
  specialization: string[];
  manipulations: string[];
  diplomasAndCertificatesFiles: IDiplomaFile[];
  hasVerifiedEmail: boolean;
  hasVerifiedMobile: boolean;
  hasVerifiedGovernmentId: boolean;
  hasVerifiedQualificationDocs: boolean;
  patientsServed: number;
  ratings: IRating[];
  isAvailable: boolean;
}

// Sub-schemas
const workExperienceSchema = new Schema<IWorkExperience>(
  {
    employer: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
  },
  { _id: false },
);

const ratingSchema = new Schema<IRating>(
  {
    patientName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { _id: false, timestamps: true },
);

const diplomaFileSchema = new Schema<IDiplomaFile>(
  {
    fileId: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
  },
  { _id: false },
);

// Main Nurse Schema
const nurseSchema = new Schema<INurse>(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    age: { type: Number, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    governmentId: { type: String, required: true, unique: true },
    photoUrl: { type: String, required: true },
    yearsOfExperience: {
      years: { type: Number, default: 0 },
      months: { type: Number, default: 0 },
    },
    workExperience: [workExperienceSchema],
    specialization: { type: [String], default: [] },
    manipulations: { type: [String], default: [] }, // Will reference strings from services
    diplomasAndCertificatesFiles: [diplomaFileSchema],

    // Specified default values
    hasVerifiedEmail: { type: Boolean, default: false },
    hasVerifiedMobile: { type: Boolean, default: false },
    hasVerifiedGovernmentId: { type: Boolean, default: false },
    hasVerifiedQualificationDocs: { type: Boolean, default: false },
    patientsServed: { type: Number, default: 0 },
    ratings: { type: [ratingSchema], default: [] },
    isAvailable: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const Nurse = model<INurse>("Nurse", nurseSchema);
