import { Schema, model, Document } from "mongoose";

interface IServiceReceived {
  serviceName: string;
  serviceCount: number;
  nurseName: string;
}

export interface IPatient extends Document {
  firstname: string;
  lastname: string;
  birthDate: Date;
  age: number;
  email: string;
  role: "admin" | "nurse" | "patient";
  passwordHash: string;
  mobile: string;
  address: string;
  governmentId: string;
  hasVerifiedEmail: boolean;
  hasVerifiedMobile: boolean;
  hasVerifiedGovernmentId: boolean;
  servicesReceived: IServiceReceived[];
}

const serviceReceivedSchema = new Schema<IServiceReceived>(
  {
    serviceName: { type: String, required: true },
    serviceCount: { type: Number, default: 0 },
    nurseName: { type: String, default: "" },
  },
  { _id: false },
);

const patientSchema = new Schema<IPatient>(
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
    role: {
      type: String,
      enum: ["admin", "nurse", "patient"],
      required: true,
    },
    passwordHash: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    governmentId: { type: String, required: true, unique: true },
    hasVerifiedEmail: { type: Boolean, default: false },
    hasVerifiedMobile: { type: Boolean, default: false },
    hasVerifiedGovernmentId: { type: Boolean, default: false },
    servicesReceived: { type: [serviceReceivedSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

export const Patient = model<IPatient>("Patient", patientSchema);
