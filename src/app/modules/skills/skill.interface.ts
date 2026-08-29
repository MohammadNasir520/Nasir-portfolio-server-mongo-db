import { Model, Types } from "mongoose";

export type ISkill = {
  _id?: Types.ObjectId;
  title: string;
  image: string;
  level: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ISkillFilters = {
  searchTerm?: string;
};

export type SkillModel = Model<ISkill, Record<string, unknown>>;
