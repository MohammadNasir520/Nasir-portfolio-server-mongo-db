import { Model, Types } from "mongoose";

export type IAchievement = {
  /** Per-locale translations of the text fields, e.g. { bn: { title } }. */
  i18n?: Record<string, Record<string, unknown>>;
  _id?: Types.ObjectId;
  title: string;
  image: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IAchievementFilters = {
  searchTerm?: string;
};

export type AchievementModel = Model<IAchievement, Record<string, unknown>>;
