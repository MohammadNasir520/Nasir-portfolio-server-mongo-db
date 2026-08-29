import { FilterQuery } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IGenericResponse } from "../../../interfaces/common";
import { bannerSearchableFields } from "./banner.constants";
import { IBanner, IBannerFilters } from "./banner.interface";
import { Banner } from "./banner.model";

const insertIntoDB = async (data: IBanner): Promise<IBanner> => {
  return Banner.create(data);
};

const getAllFromDB = async (
  filters: IBannerFilters
): Promise<IGenericResponse<IBanner[]>> => {
  const { searchTerm } = filters;
  const andConditions: FilterQuery<IBanner>[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: bannerSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  const whereConditions: FilterQuery<IBanner> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Banner.find(whereConditions);
  const total = await Banner.countDocuments(whereConditions);

  return {
    meta: { total },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<IBanner | null> => {
  return Banner.findById(id);
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IBanner>
): Promise<IBanner | null> => {
  const result = await Banner.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Banner not found");
  }
  return result;
};

const deleteFromDB = async (id: string): Promise<IBanner | null> => {
  const result = await Banner.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Banner not found");
  }
  return result;
};

export const BannerService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
