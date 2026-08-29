import { FilterQuery } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IGenericResponse } from "../../../interfaces/common";
import { skillSearchableFields } from "./skill.constants";
import { ISkill, ISkillFilters } from "./skill.interface";
import { Skill } from "./skill.model";

const insertIntoDB = async (data: ISkill): Promise<ISkill> => {
  return Skill.create(data);
};

const getAllFromDB = async (
  filters: ISkillFilters
): Promise<IGenericResponse<ISkill[]>> => {
  const { searchTerm } = filters;
  const andConditions: FilterQuery<ISkill>[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: skillSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  const whereConditions: FilterQuery<ISkill> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Skill.find(whereConditions);
  const total = await Skill.countDocuments(whereConditions);

  return {
    meta: { total },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<ISkill | null> => {
  return Skill.findById(id);
};

const updateIntoDB = async (
  id: string,
  payload: Partial<ISkill>
): Promise<ISkill | null> => {
  const result = await Skill.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Skill not found");
  }
  return result;
};

const deleteFromDB = async (id: string): Promise<ISkill | null> => {
  const result = await Skill.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Skill not found");
  }
  return result;
};

export const SkillsService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
