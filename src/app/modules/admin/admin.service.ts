import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
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

/**
 * Returns every privileged account, and an empty array when there are none.
 *
 * It used to query `role: "admin"` only - hiding super_admins from the list
 * that super_admins alone can act on - and to throw 404 on an empty result,
 * which a dashboard table cannot distinguish from a real failure.
 */
const getAllFromDB = async (): Promise<Partial<IUser>[]> => {
  return User.find({
    role: { $in: [ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN] },
  })
    .select(userPublicFields)
    .sort({ createdAt: 1 });
};

const getByIdFromDB = async (id: string): Promise<Partial<IUser> | null> => {
  const result = await User.findById(id).select(userPublicFields);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  return result;
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

/**
 * Two lockout guards, because the dashboard puts a delete button next to every
 * row: you cannot delete the account you are signed in as, and you cannot
 * remove the last super_admin (nothing could then reach POST /admins to make
 * another one).
 */
const deleteFromDB = async (
  id: string,
  actor: JwtPayload
): Promise<Partial<IUser> | null> => {
  if (actor.userId === id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You cannot delete the account you are signed in as"
    );
  }

  const target = await User.findById(id).select(userPublicFields);
  if (!target) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  if (target.role === ENUM_USER_ROLE.SUPER_ADMIN) {
    const superAdmins = await User.countDocuments({
      role: ENUM_USER_ROLE.SUPER_ADMIN,
    });
    if (superAdmins <= 1) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cannot delete the last super admin"
      );
    }
  }

  await User.findByIdAndDelete(id);
  return target;
};

export const AdminService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
