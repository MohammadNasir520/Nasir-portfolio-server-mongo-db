import { Model, Types } from "mongoose";

export type IBlog = {
  _id?: Types.ObjectId;
  title: string;
  text: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IBlogFilters = {
  searchTerm?: string;
};

export type BlogModel = Model<IBlog, Record<string, unknown>>;
