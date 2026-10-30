import { FilterQuery, SortOrder } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { BD_DISTRICTS, DISTRICT_GOAL } from "./bdDistricts";
import { travelPlaceSearchableFields } from "./travel.constants";
import {
  ITravelOverview,
  ITravelPlace,
  ITravelPlaceFilters,
  ITravelStats,
} from "./travel.interface";
import { TravelOverview, TravelPlace } from "./travel.model";

const insertIntoDB = async (data: ITravelPlace): Promise<ITravelPlace> => {
  return TravelPlace.create(data);
};

const getAllFromDB = async (
  filters: ITravelPlaceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITravelPlace[]>> => {
  const { searchTerm, featured, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: FilterQuery<ITravelPlace>[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: travelPlaceSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // Query strings arrive as text, so coerce the boolean explicitly.
  if (featured !== undefined) {
    andConditions.push({ featured: featured === "true" });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: FilterQuery<ITravelPlace> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = sortBy
    ? { [sortBy]: sortOrder }
    : { visitedOn: -1 };

  const result = await TravelPlace.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await TravelPlace.countDocuments(whereConditions);

  return { meta: { page, limit, total }, data: result };
};

const getByIdFromDB = async (id: string): Promise<ITravelPlace | null> => {
  return TravelPlace.findById(id);
};

const updateIntoDB = async (
  id: string,
  payload: Partial<ITravelPlace>
): Promise<ITravelPlace | null> => {
  const result = await TravelPlace.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Travel place not found");
  return result;
};

const deleteFromDB = async (id: string): Promise<ITravelPlace | null> => {
  const result = await TravelPlace.findByIdAndDelete(id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Travel place not found");
  return result;
};

/** The canonical district list, so the frontend keeps no second copy. */
const getDistricts = async () => ({
  districts: BD_DISTRICTS,
  goalDistricts: DISTRICT_GOAL,
});

const getStats = async (): Promise<ITravelStats> => {
  const visited = await TravelPlace.find({ status: "visited" });

  // Excluded districts (Kushtia) must never count toward the goal.
  const excluded = new Set(
    BD_DISTRICTS.filter((d) => d.excluded).map((d) => d.name)
  );
  const districts = new Set(
    visited
      .map((place) => place.district)
      .filter((d): d is string => Boolean(d) && !excluded.has(d as string))
  );
  const countries = new Set(visited.map((place) => place.country));
  const photos = visited.reduce(
    (sum, place) => sum + (place.images?.length ?? 0),
    0
  );

  return {
    countries: countries.size,
    districtsVisited: districts.size,
    goalDistricts: DISTRICT_GOAL,
    placesVisited: visited.length,
    placesPlanned: await TravelPlace.countDocuments({ status: "planned" }),
    photos,
  };
};

const getOverview = async (): Promise<ITravelOverview | null> => {
  return TravelOverview.findOne();
};

const updateOverview = async (
  payload: Partial<ITravelOverview>
): Promise<ITravelOverview | null> => {
  // Singleton: create it on first write rather than requiring a seed.
  return TravelOverview.findOneAndUpdate({}, payload, {
    new: true,
    upsert: true,
    runValidators: true,
  });
};

export const TravelService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  getDistricts,
  getStats,
  getOverview,
  updateOverview,
};
