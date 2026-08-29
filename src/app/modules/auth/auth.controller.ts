import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ILoginUserResponse } from "./auth.interface";
import { AuthService } from "./auth.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, ...others } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.env === "production",
    httpOnly: true,
    sameSite: "none",
  });

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User loggedIn successfully !",
    data: others,
  });
});

export const AuthController = {
  insertIntoDB,
  loginUser,
};
