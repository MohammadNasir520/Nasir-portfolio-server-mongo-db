import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { askAssistant } from "./aiAssistant.route.service";

const ask = catchAsync(async (req: Request, res: Response) => {
  const result = await askAssistant(req.body.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assistant answered successfully",
    data: result,
  });
});

export const AiAssistantController = {
  ask,
};
