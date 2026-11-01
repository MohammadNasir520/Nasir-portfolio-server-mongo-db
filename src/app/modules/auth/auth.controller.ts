import { Request, Response } from "express";
import httpStatus from "http-status";
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
  // No refresh-token cookie: nothing ever read it (there is no refresh
  // endpoint), and outside production browsers rejected it anyway.
  const result = await AuthService.loginUser(req.body);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User loggedIn successfully !",
    data: result,
  });
});

export const AuthController = {
  insertIntoDB,
  loginUser,
};
