import { Model, Types } from "mongoose";

export type IBanner = {
  _id?: Types.ObjectId;
  title: string;
  logo: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IBannerFilters = {
  searchTerm?: string;
};

export type BannerModel = Model<IBanner, Record<string, unknown>>;
