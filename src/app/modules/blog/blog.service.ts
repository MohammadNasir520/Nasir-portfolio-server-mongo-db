import { escapeRegex } from "../../../shared/escapeRegex";
import { FilterQuery } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IGenericResponse } from "../../../interfaces/common";
import { blogSearchableFields } from "./blog.constants";
import { IBlog, IBlogFilters } from "./blog.interface";
import { Blog } from "./blog.model";

const insertIntoDB = async (data: IBlog): Promise<IBlog> => {
  return Blog.create(data);
};

const getAllFromDB = async (
  filters: IBlogFilters
): Promise<IGenericResponse<IBlog[]>> => {
  const { searchTerm } = filters;
  const andConditions: FilterQuery<IBlog>[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: blogSearchableFields.map((field) => ({
        [field]: { $regex: escapeRegex(searchTerm), $options: "i" },
      })),
    });
  }

  const whereConditions: FilterQuery<IBlog> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Blog.find(whereConditions);
  const total = await Blog.countDocuments(whereConditions);

  return {
    meta: { total },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<IBlog> => {
  const result = await Blog.findById(id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IBlog>
): Promise<IBlog | null> => {
  const result = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }
  return result;
};

const deleteFromDB = async (id: string): Promise<IBlog | null> => {
  const result = await Blog.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }
  return result;
};

export const BlogService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
