import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { userPublicFields } from "../user/user.constants";

const getByIdFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
  const result = await User.findById(user.userId).select(userPublicFields);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "your profile does not exist");
  }
  return result;
};

const updateByIdFromDB = async (
  user: JwtPayload,
  data: Partial<IUser>
): Promise<Partial<IUser> | null> => {
  const profile = await User.findById(user.userId).select("+password");
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "your profile does not exist");
  }

  // Role changes are an admin action, never a self-service profile edit.
  const { role, ...safePayload } = data;

  Object.assign(profile, safePayload);
  await profile.save();

  return User.findById(user.userId).select(userPublicFields);
};

export const ProfileService = {
  getByIdFromDB,
  updateByIdFromDB,
};
