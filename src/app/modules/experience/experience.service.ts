import { escapeRegex } from "../../../shared/escapeRegex";
import { FilterQuery } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IGenericResponse } from "../../../interfaces/common";
import { experienceSearchableFields } from "./experience.constants";
import { IExperience, IExperienceFilters } from "./experience.interface";
import { Experience } from "./experience.model";

const insertIntoDB = async (data: IExperience): Promise<IExperience> => {
  return Experience.create(data);
};

const getAllFromDB = async (
  filters: IExperienceFilters
): Promise<IGenericResponse<IExperience[]>> => {
  const { searchTerm, ...filterData } = filters;
  const andConditions: FilterQuery<IExperience>[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: experienceSearchableFields.map((field) => ({
        [field]: { $regex: escapeRegex(searchTerm), $options: "i" },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        // `current` arrives as the string "true"/"false" from the query string.
        [field]: field === "current" ? value === "true" : value,
      })),
    });
  }

  const whereConditions: FilterQuery<IExperience> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // Newest role first: ongoing roles float to the top, then by most recent start.
  const result = await Experience.find(whereConditions).sort({
    current: -1,
    startDate: -1,
  });
  const total = await Experience.countDocuments(whereConditions);

  return {
    meta: { total },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<IExperience> => {
  const result = await Experience.findById(id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Experience not found");
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IExperience>
): Promise<IExperience | null> => {
  const result = await Experience.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Experience not found");
  }
  return result;
};

const deleteFromDB = async (id: string): Promise<IExperience | null> => {
  const result = await Experience.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Experience not found");
  }
  return result;
};

export const ExperienceService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
