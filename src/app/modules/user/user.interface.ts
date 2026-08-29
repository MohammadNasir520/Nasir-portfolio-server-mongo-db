import { Model, Types } from "mongoose";
import { ENUM_USER_ROLE } from "../../../enums/user";

export type IUser = {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: ENUM_USER_ROLE | string;
  contactNo: string;
  image1?: string;
  image2?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IUserMethods = {
  isPasswordMatched(givenPassword: string): Promise<boolean>;
};

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
