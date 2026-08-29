import { FilterQuery } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IGenericResponse } from "../../../interfaces/common";
import { achievementSearchableFields } from "./achievement.constants";
import { IAchievement, IAchievementFilters } from "./achievement.interface";
import { Achievement } from "./achievement.model";

const insertIntoDB = async (data: IAchievement): Promise<IAchievement> => {
  return Achievement.create(data);
};

const getAllFromDB = async (
  filters: IAchievementFilters
): Promise<IGenericResponse<IAchievement[]>> => {
  const { searchTerm } = filters;
  const andConditions: FilterQuery<IAchievement>[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: achievementSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  const whereConditions: FilterQuery<IAchievement> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Achievement.find(whereConditions);
  const total = await Achievement.countDocuments(whereConditions);

  return {
    meta: { total },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<IAchievement | null> => {
  return Achievement.findById(id);
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IAchievement>
): Promise<IAchievement | null> => {
  const result = await Achievement.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Achievement not found");
  }
  return result;
};

const deleteFromDB = async (id: string): Promise<IAchievement | null> => {
  const result = await Achievement.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Achievement not found");
  }
  return result;
};

export const AchievementService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
