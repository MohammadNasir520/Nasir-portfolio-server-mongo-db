import { FilterQuery } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IGenericResponse } from "../../../interfaces/common";
import { extraActivitiesSearchableFields } from "./extraActivities.constants";
import { IExtraActivities, IExtraActivitiesFilters } from "./extraActivities.interface";
import { ExtraActivities } from "./extraActivities.model";

const insertIntoDB = async (data: IExtraActivities): Promise<IExtraActivities> => {
  return ExtraActivities.create(data);
};

const getAllFromDB = async (
  filters: IExtraActivitiesFilters
): Promise<IGenericResponse<IExtraActivities[]>> => {
  const { searchTerm } = filters;
  const andConditions: FilterQuery<IExtraActivities>[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: extraActivitiesSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  const whereConditions: FilterQuery<IExtraActivities> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await ExtraActivities.find(whereConditions);
  const total = await ExtraActivities.countDocuments(whereConditions);

  return {
    meta: { total },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<IExtraActivities | null> => {
  return ExtraActivities.findById(id);
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IExtraActivities>
): Promise<IExtraActivities | null> => {
  const result = await ExtraActivities.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "ExtraActivities not found");
  }
  return result;
};

const deleteFromDB = async (id: string): Promise<IExtraActivities | null> => {
  const result = await ExtraActivities.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "ExtraActivities not found");
  }
  return result;
};

export const ExtraActivitiesService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
