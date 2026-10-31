import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TranslationService } from "./translation.service";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await TranslationService.getAll(
    req.query.lang as string | undefined,
    req.query.route as string | undefined
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Translations fetched successfully",
    data: result,
  });
});

const upsert = catchAsync(async (req: Request, res: Response) => {
  const result = await TranslationService.upsert(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Translation saved successfully",
    data: result,
  });
});

export const TranslationController = { getAll, upsert };
