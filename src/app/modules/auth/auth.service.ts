import httpStatus from "http-status";
import { Secret, SignOptions } from "jsonwebtoken";
import config from "../../../config";
import { ENUM_USER_ROLE } from "../../../enums/user";
import ApiError from "../../../errors/ApiError";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { ILoginUser, ILoginUserResponse } from "./auth.interface";

const insertIntoDB = async (data: IUser): Promise<Partial<IUser>> => {
  const isExist = await User.findOne({ email: data.email });
  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User already exists with this email"
    );
  }

  // Self-registration can only ever produce a powerless account. Privileged
  // accounts are created by a super_admin through POST /admins. Forced here as
  // well as omitted from the zod schema - two independent locks on the same
  // door, because this route is public.
  const result = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    role: ENUM_USER_ROLE.USER,
  });
  return result.toJSON();
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email }).select("+password");

  // One answer for both failures, so the login form can't be used to find
  // out which emails have accounts.
  if (!isUserExist || !(await isUserExist.isPasswordMatched(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const userId = isUserExist._id?.toString();
  const { role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as SignOptions["expiresIn"]
  );

  return { accessToken };
};

export const AuthService = {
  insertIntoDB,
  loginUser,
};
