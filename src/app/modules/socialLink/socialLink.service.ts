import { FilterQuery } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IGenericResponse } from "../../../interfaces/common";
import { ISocialLink, ISocialLinkFilters } from "./socialLink.interface";
import { SocialLink } from "./socialLink.model";

const insertIntoDB = async (data: ISocialLink): Promise<ISocialLink> => {
  return SocialLink.create(data);
};

const getAllFromDB = async (
  filters: ISocialLinkFilters
): Promise<IGenericResponse<ISocialLink[]>> => {
  // No searchable text fields on this model — filters are accepted but unused.
  const whereConditions: FilterQuery<ISocialLink> = {};

  const result = await SocialLink.find(whereConditions);
  const total = await SocialLink.countDocuments(whereConditions);

  return {
    meta: { total },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<ISocialLink | null> => {
  return SocialLink.findById(id);
};

const updateIntoDB = async (
  id: string,
  payload: Partial<ISocialLink>
): Promise<ISocialLink | null> => {
  const result = await SocialLink.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "SocialLink not found");
  }
  return result;
};

const deleteFromDB = async (id: string): Promise<ISocialLink | null> => {
  const result = await SocialLink.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "SocialLink not found");
  }
  return result;
};

export const SocialLinkService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
