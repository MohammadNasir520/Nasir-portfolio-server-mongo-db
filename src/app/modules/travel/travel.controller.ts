import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { paginationFields } from "../../constants/pagination";
import { travelPlaceFilterableFields } from "./travel.constants";
import { TravelService } from "./travel.service";
import { parseLang } from "../../../shared/localize";

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
  const result = await TravelService.getAllFromDB(filters, paginationOptions, parseLang(req.query.lang));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel places fetched successfully",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelService.getByIdFromDB(req.params.id, parseLang(req.query.lang));
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

const getOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelService.getOverview(parseLang(req.query.lang));
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

/** Crawlers, link unfurlers and monitors - real readers don't send these. */
const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|quora|whatsapp|telegram|discord|curl|wget|python|axios|node-fetch|headless|lighthouse|pingdom|uptime/i;

/** One counted view per visitor per place per window. */
const VIEW_WINDOW_MS = 30 * 60 * 1000;
const recentViews = new Map<string, number>();

const clientIp = (req: Request) => {
  const fwd = req.headers["x-forwarded-for"];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim();
  return first || req.ip || req.socket.remoteAddress || "unknown";
};

/**
 * Whether this request should count. Best-effort: the map lives per server
 * instance (like the rate limiter), which is fine for a view counter - the
 * client also only reports once per browser session.
 */
const shouldCount = (req: Request, id: string) => {
  if (BOT_UA.test(String(req.headers["user-agent"] ?? ""))) return false;
  const now = Date.now();
  const key = `${clientIp(req)}:${id}`;
  const last = recentViews.get(key);
  if (last && now - last < VIEW_WINDOW_MS) return false;
  recentViews.set(key, now);
  if (recentViews.size > 10_000) {
    for (const [k, t] of recentViews) if (now - t >= VIEW_WINDOW_MS) recentViews.delete(k);
  }
  return true;
};

const recordView = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TravelService.recordView(id, shouldCount(req, id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "View recorded",
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
  recordView,
  getOverview,
  updateOverview,
};
