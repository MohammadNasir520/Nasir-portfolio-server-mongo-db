import { Model, Types } from "mongoose";

export type IExtraActivities = {
  /** Per-locale translations of the text fields, e.g. { bn: { title } }. */
  i18n?: Record<string, Record<string, unknown>>;
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
