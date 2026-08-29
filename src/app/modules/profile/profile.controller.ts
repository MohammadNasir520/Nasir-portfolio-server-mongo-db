import { Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProfileService } from "./profile.service";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await ProfileService.getByIdFromDB(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "profile fetched successfully",
    data: result,
  });
});

const updateByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await ProfileService.updateByIdFromDB(user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "profile updated successfully",
    data: result,
  });
});

export const ProfileController = {
  getAllFromDB,
  updateByIdFromDB,
};
