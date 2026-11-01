import { escapeRegex } from "../../../shared/escapeRegex";
import { FilterQuery } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import {
  projectsExactFilterFields,
  projectsSearchableFields,
} from "./learningProjects.constants";
import {
  IProjects,
  IProjectsFilters,
  IProjectsListResponse,
} from "./learningProjects.interface";
import { Projects } from "./learningProjects.model";

const insertIntoDB = async (data: IProjects): Promise<IProjects> => {
  return Projects.create(data);
};

const getAllFromDB = async (
  filters: IProjectsFilters
): Promise<IProjectsListResponse> => {
  const { searchTerm, technology, ...filterData } = filters;
  const andConditions: FilterQuery<IProjects>[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: projectsSearchableFields.map((field) => ({
        [field]: { $regex: escapeRegex(searchTerm), $options: "i" },
      })),
    });
  }

  const exactFilters = Object.entries(filterData).filter(
    ([key, value]) =>
      projectsExactFilterFields.includes(key) &&
      value !== undefined &&
      value !== ""
  );

  if (exactFilters.length > 0) {
    andConditions.push({
      $and: exactFilters.map(([key, value]) => ({ [key]: value })),
    });
  }

  // Match a project if it uses ANY of the requested technologies (Prisma hasSome).
  if (technology) {
    const technologies = Array.isArray(technology) ? technology : [technology];
    andConditions.push({ technology: { $in: technologies } });
  }

  const whereConditions: FilterQuery<IProjects> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Projects.find(whereConditions);
  const total = await Projects.countDocuments(whereConditions);

  // Rows live under `meta.data` on purpose — see IProjectsListResponse.
  return {
    meta: {
      total,
      data: result,
    },
  };
};

const getByIdFromDB = async (id: string): Promise<IProjects> => {
  const result = await Projects.findById(id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IProjects>
): Promise<IProjects | null> => {
  const result = await Projects.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }
  return result;
};

const deleteFromDB = async (id: string): Promise<IProjects | null> => {
  const result = await Projects.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }
  return result;
};

export const LearningProjectsService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
