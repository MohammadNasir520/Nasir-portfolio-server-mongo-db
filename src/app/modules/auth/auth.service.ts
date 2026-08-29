import httpStatus from "http-status";
import { Secret, SignOptions } from "jsonwebtoken";
import config from "../../../config";
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

  // Hashed by the pre-save hook on the model.
  const result = await User.create(data);
  return result.toJSON();
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email }).select("+password");

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const isPasswordMatched = await isUserExist.isPasswordMatched(password);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Password");
  }

  const userId = isUserExist._id?.toString();
  const { role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as SignOptions["expiresIn"]
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as SignOptions["expiresIn"]
  );

  return { accessToken, refreshToken };
};

export const AuthService = {
  insertIntoDB,
  loginUser,
};
