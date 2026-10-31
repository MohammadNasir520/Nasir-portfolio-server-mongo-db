import { Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TravelMapService } from "./travelMap.service";

const getMine = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelMapService.getMine(req.user as JwtPayload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel map fetched successfully",
    data: result,
  });
});

const saveMine = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelMapService.saveMine(req.user as JwtPayload, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel map saved successfully",
    data: result,
  });
});

export const TravelMapController = { getMine, saveMine };
