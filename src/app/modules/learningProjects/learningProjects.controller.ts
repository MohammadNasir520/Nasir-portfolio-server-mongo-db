import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { projectsFilterableFields } from "./learningProjects.constants";
import { LearningProjectsService } from "./learningProjects.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await LearningProjectsService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "learningProjects created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, projectsFilterableFields);
  const result = await LearningProjectsService.getAllFromDB(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "learningProjects fetched successfully",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await LearningProjectsService.getByIdFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "learningProjects fetched successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await LearningProjectsService.updateIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "learningProjects updated successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await LearningProjectsService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "learningProjects deleted successfully",
    data: result,
  });
});

export const LearningProjectsController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
