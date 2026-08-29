import { Model, Types } from "mongoose";

export type IAchievement = {
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
