import { FilterQuery } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IGenericResponse } from "../../../interfaces/common";
import { aboutSearchableFields } from "./about.constants";
import { IAbout, IAboutFilters } from "./about.interface";
import { About } from "./about.model";

const insertIntoDB = async (data: IAbout): Promise<IAbout> => {
  return About.create(data);
};

const getAllFromDB = async (
  filters: IAboutFilters
): Promise<IGenericResponse<IAbout[]>> => {
  const { searchTerm } = filters;
  const andConditions: FilterQuery<IAbout>[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: aboutSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  const whereConditions: FilterQuery<IAbout> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await About.find(whereConditions);
  const total = await About.countDocuments(whereConditions);

  return {
    meta: { total },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<IAbout | null> => {
  return About.findById(id);
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IAbout>
): Promise<IAbout | null> => {
  const result = await About.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "About not found");
  }
  return result;
};

const deleteFromDB = async (id: string): Promise<IAbout | null> => {
  const result = await About.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "About not found");
  }
  return result;
};

export const AboutService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
