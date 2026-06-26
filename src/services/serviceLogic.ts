import { Service as ServiceModel } from "../models/Service.js";

// Represent the actual document properties coming from MongoDB
export interface IServiceDocument {
  _id: string;
  name: string;
  img: string;
  createdAt: Date;
  updatedAt: Date;
}

export const fetchAndFormatServices = async (): Promise<IServiceDocument[]> => {
  // // .lean() pulls raw objects out of MongoDB instantly and retains _id, name, img, and timestamps
  const servicesFromDb = await ServiceModel.find({}).lean();

  return servicesFromDb.map((service: any) => ({
    _id: service._id.toString(),
    name: service.name,
    img: service.img,
    // Extracts the timestamp directly from MongoDB's internal _id, no fallbacks needed
    createdAt: service.createdAt || service._id.getTimestamp(),
    updatedAt: service.updatedAt || service._id.getTimestamp(),
  }));
};

export const fetchServiceNamesOnly = async (): Promise<string[]> => {
  const servicesFromDb = await ServiceModel.find({}, "name").lean();

  return servicesFromDb.map((service) => service.name);
};
