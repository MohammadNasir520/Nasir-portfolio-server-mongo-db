import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SiteProfileService } from "./siteProfile.service";

const getSiteProfile = catchAsync(async (_req: Request, res: Response) => {
  const result = await SiteProfileService.getSiteProfile();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Site profile fetched successfully",
    data: result,
  });
});

const updateSiteProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await SiteProfileService.updateSiteProfile(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Site profile updated successfully",
    data: result,
  });
});

export const SiteProfileController = {
  getSiteProfile,
  updateSiteProfile,
};
