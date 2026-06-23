import { IWorkExperience } from "../models/Nurse.js";

/**
 * Calculate age based on birth date string or Date object
 */
export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

/**
 * Calculate total years and months of experience by summing job durations
 */
export const calculateExperience = (
  workExperience: IWorkExperience[],
): { years: number; months: number } => {
  let totalMonths = 0;

  workExperience.forEach((job) => {
    const start = new Date(job.startDate);
    const end = job.endDate ? new Date(job.endDate) : new Date();

    // Total months calculation between two dates
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    if (months > 0) totalMonths += months;
  });

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  return {
    years: years >= 0 ? years : 0,
    months: remainingMonths >= 0 ? remainingMonths : 0,
  };
};
