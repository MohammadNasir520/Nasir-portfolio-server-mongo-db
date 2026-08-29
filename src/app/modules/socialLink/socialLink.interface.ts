import { Model, Types } from "mongoose";

export type ISocialLink = {
  _id?: Types.ObjectId;
  facebook?: string;
  youtube?: string;
  linkedIn?: string;
  instagram?: string;
  twitter?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ISocialLinkFilters = {
  searchTerm?: string;
};

export type SocialLinkModel = Model<ISocialLink, Record<string, unknown>>;
