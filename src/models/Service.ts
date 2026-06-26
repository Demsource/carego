import { Schema, model, Document } from "mongoose";

export interface IService extends Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  img: string;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }, // Keep track of when data is added
);

export const Service = model<IService>("Service", serviceSchema);
