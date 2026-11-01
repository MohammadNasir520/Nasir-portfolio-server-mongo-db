import { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AnalyticsRange } from "./analytics.interface";
import { AnalyticsService, visitorHash } from "./analytics.service";
import { BOT_UA, parseUserAgent } from "./userAgent";

const clientIp = (req: Request) => {
  const fwd = req.headers["x-forwarded-for"];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim();
  return first || req.ip || req.socket.remoteAddress || "unknown";
};

/** Vercel adds these on every request; locally they are absent. */
const geo = (req: Request) => {
  const h = (name: string) => {
    const v = req.headers[name];
    const s = Array.isArray(v) ? v[0] : v;
    if (!s) return null;
    try {
      return decodeURIComponent(s).slice(0, 80);
    } catch {
      return s.slice(0, 80);
    }
  };
  return {
    country: h("x-vercel-ip-country"),
    region: h("x-vercel-ip-country-region"),
    city: h("x-vercel-ip-city"),
  };
};

const PRIVATE_PATHS = /^\/(dashboard|login|signup|profile|user)(\/|$)/;

const splitReferrer = (referrer?: string | null, selfHost?: string) => {
  if (!referrer) return { referrerHost: null, referrerPath: null };
  try {
    const u = new URL(referrer);
    const host = u.hostname.replace(/^www\./, "");
    // Internal navigation is not a traffic source.
    if (selfHost && host === selfHost.replace(/^www\./, "")) return { referrerHost: null, referrerPath: null };
    return { referrerHost: host.slice(0, 100), referrerPath: u.pathname.slice(0, 200) };
  } catch {
    return { referrerHost: null, referrerPath: null };
  }
};

const collect = catchAsync(async (req: Request, res: Response) => {
  const ua = String(req.headers["user-agent"] ?? "");
  const body = req.body as {
    path: string;
    title?: string | null;
    referrer?: string | null;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    screen?: string | null;
    language?: string | null;
    timezone?: string | null;
    sessionId: string;
    returning?: boolean;
  };

  // Bots and private pages are acknowledged but not stored.
  if (BOT_UA.test(ua) || PRIVATE_PATHS.test(body.path)) {
    return sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Ignored", data: { id: null } });
  }

  const path = body.path.split("?")[0].split("#")[0];
  const placeMatch = path.match(/^\/travel\/([0-9a-f]{24})$/);
  const origin = req.headers.origin ? new URL(String(req.headers.origin)).hostname : undefined;

  const result = await AnalyticsService.create({
    path,
    title: body.title ?? undefined,
    placeId: placeMatch ? new Types.ObjectId(placeMatch[1]) : null,
    ...splitReferrer(body.referrer, origin),
    utmSource: body.utmSource?.toLowerCase() || null,
    utmMedium: body.utmMedium?.toLowerCase() || null,
    utmCampaign: body.utmCampaign || null,
    ...parseUserAgent(ua),
    screen: body.screen ?? null,
    language: body.language?.split("-")[0]?.toLowerCase() ?? null,
    timezone: body.timezone ?? null,
    ...geo(req),
    sessionId: body.sessionId,
    visitorHash: visitorHash(clientIp(req), ua),
    returning: Boolean(body.returning),
    duration: 0,
  });

  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Recorded", data: result });
});

/**
 * Time on page. Sent with navigator.sendBeacon as text/plain (a "simple"
 * cross-origin request, so no preflight is needed while the page unloads).
 */
const duration = catchAsync(async (req: Request, res: Response) => {
  let payload: { sessionId?: unknown; seconds?: unknown };
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};
  } catch {
    payload = {};
  }
  const seconds = Number(payload.seconds);
  if (typeof payload.sessionId === "string" && Number.isFinite(seconds)) {
    await AnalyticsService.setDuration(req.params.id, payload.sessionId, seconds);
  }
  res.status(httpStatus.NO_CONTENT).end();
});

const summary = catchAsync(async (req: Request, res: Response) => {
  const range = (req.query.range as AnalyticsRange) || "7d";
  const result = await AnalyticsService.summary(range);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Analytics summary", data: result });
});

const live = catchAsync(async (_req: Request, res: Response) => {
  const result = await AnalyticsService.live();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Live analytics", data: result });
});

const session = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsService.session(req.params.sessionId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Session journey", data: result });
});

export const AnalyticsController = { collect, duration, summary, live, session };
