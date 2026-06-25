import { Nurse, INurse } from "../models/Nurse.js";

export const getPopularNurses = async (): Promise<Partial<INurse>[]> => {
  // Query only the 5 required properties using a Mongoose projection space string
  const popularNurses = await Nurse.find({})
    .sort({ createdAt: -1 }) // Temporary popularity placeholder logic
    .limit(4)
    .select("photoUrl firstname lastname workExperience specialization")
    .lean(); // Converts to plain JSON objects for optimized read speeds

  return popularNurses;
};
