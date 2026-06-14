import { Service as ServiceModel } from "../models/Service.js";

export const fetchAndFormatServices = async (): Promise<string[]> => {
  const servicesFromDb = await ServiceModel.find({}, "name");
  return servicesFromDb.map((service) => service.name);
};
