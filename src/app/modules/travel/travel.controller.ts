import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { paginationFields } from "../../constants/pagination";
import { travelPlaceFilterableFields } from "./travel.constants";
import { TravelService } from "./travel.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel place created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, travelPlaceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await TravelService.getAllFromDB(filters, paginationOptions);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel places fetched successfully",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelService.getByIdFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel place fetched successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelService.updateIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel place updated successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel place deleted successfully",
    data: result,
  });
});

const getDistricts = catchAsync(async (_req: Request, res: Response) => {
  const result = await TravelService.getDistricts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Districts fetched successfully",
    data: result,
  });
});

const getStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await TravelService.getStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel stats fetched successfully",
    data: result,
  });
});

const getOverview = catchAsync(async (_req: Request, res: Response) => {
  const result = await TravelService.getOverview();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel overview fetched successfully",
    data: result,
  });
});

const updateOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelService.updateOverview(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel overview updated successfully",
    data: result,
  });
});

export const TravelController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  getDistricts,
  getStats,
  getOverview,
  updateOverview,
};
