import { Service as ServiceModel } from "../models/Service.js";

export interface IFormattedService {
  name: string;
  img: string;
}

export const fetchAndFormatServices = async (): Promise<IFormattedService[]> => {
  const servicesFromDb = await ServiceModel.find({}, "name img");
  
  return servicesFromDb.map((service) => ({
    name: service.name,
    img: service.img,
  }));
};
