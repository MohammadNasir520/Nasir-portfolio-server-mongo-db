import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UploadsService } from "./uploads.service";

const createUploadSignature = catchAsync(async (req: Request, res: Response) => {
  const result = await UploadsService.createUploadSignature(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Upload signature created successfully",
    data: result,
  });
});

export const UploadsController = {
  createUploadSignature,
};
