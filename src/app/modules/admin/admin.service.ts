import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { userPublicFields } from "../user/user.constants";

const insertIntoDB = async (data: IUser): Promise<Partial<IUser>> => {
  const isExist = await User.findOne({ email: data.email });
  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Admin already exist by the email"
    );
  }

  data.role = ENUM_USER_ROLE.ADMIN;
  const result = await User.create(data);
  return result.toJSON();
};

const getAllFromDB = async (): Promise<Partial<IUser>[]> => {
  const result = await User.find({ role: ENUM_USER_ROLE.ADMIN }).select(
    userPublicFields
  );

  if (!result || result.length <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "admin not found");
  }
  return result;
};

const getByIdFromDB = async (id: string): Promise<Partial<IUser> | null> => {
  return User.findById(id).select(userPublicFields);
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IUser>
): Promise<Partial<IUser> | null> => {
  const admin = await User.findById(id).select("+password");
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  // Assign then save so the pre-save hook re-hashes a changed password.
  Object.assign(admin, payload);
  await admin.save();

  return User.findById(id).select(userPublicFields);
};

const deleteFromDB = async (id: string): Promise<Partial<IUser> | null> => {
  const result = await User.findByIdAndDelete(id).select(userPublicFields);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  return result;
};

export const AdminService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
