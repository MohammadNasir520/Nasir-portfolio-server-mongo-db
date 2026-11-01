import { Model, Types } from "mongoose";

export type IAbout = {
  /** Per-locale translations of the text fields, e.g. { bn: { title } }. */
  i18n?: Record<string, Record<string, unknown>>;
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
