import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { socialLinkFilterableFields } from "./socialLink.constants";
import { SocialLinkService } from "./socialLink.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SocialLinkService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SocialLink created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, socialLinkFilterableFields);
  const result = await SocialLinkService.getAllFromDB(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SocialLink fetched successfully",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SocialLinkService.getByIdFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SocialLink fetched successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SocialLinkService.updateIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SocialLink updated successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SocialLinkService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SocialLink deleted successfully",
    data: result,
  });
});

export const SocialLinkController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
