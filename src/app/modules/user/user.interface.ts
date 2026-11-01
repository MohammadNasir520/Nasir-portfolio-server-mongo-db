import { Model, Types } from "mongoose";
import { ENUM_USER_ROLE } from "../../../enums/user";

export type IUser = {
  _id?: Types.ObjectId;
  name: string;
  /** The sign-in credential. The published contact address is siteProfile.email. */
  email: string;
  password: string;
  role: ENUM_USER_ROLE | string;
  passwordChangedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IUserMethods = {
  isPasswordMatched(givenPassword: string): Promise<boolean>;
};

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
