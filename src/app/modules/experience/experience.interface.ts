import { Model, Types } from "mongoose";

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export type IExperience = {
  _id?: Types.ObjectId;
  company: string;
  role: string;
  employmentType: EmploymentType | string;
  location?: string;
  logo?: string;
  startDate: Date;
  /** Omitted while `current` is true. */
  endDate?: Date | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  technology: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type IExperienceFilters = {
  searchTerm?: string;
  company?: string;
  current?: string;
};

export type ExperienceModel = Model<IExperience, Record<string, unknown>>;
