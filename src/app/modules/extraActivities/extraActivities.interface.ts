import { Model, Types } from "mongoose";

export type IExtraActivities = {
  _id?: Types.ObjectId;
  title: string;
  image: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IExtraActivitiesFilters = {
  searchTerm?: string;
};

export type ExtraActivitiesModel = Model<IExtraActivities, Record<string, unknown>>;
