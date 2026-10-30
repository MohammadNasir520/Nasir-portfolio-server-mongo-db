import { Model, Types } from "mongoose";

export type IAbout = {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IAboutFilters = {
  searchTerm?: string;
};

export type AboutModel = Model<IAbout, Record<string, unknown>>;
