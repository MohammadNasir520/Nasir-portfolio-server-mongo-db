import { Model, Types } from "mongoose";

export type IBlog = {
  /** Per-locale translations of the text fields, e.g. { bn: { title } }. */
  i18n?: Record<string, Record<string, unknown>>;
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
