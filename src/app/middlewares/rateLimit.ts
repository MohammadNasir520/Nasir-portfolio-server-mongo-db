import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";

const getFirstForwardedIp = (forwardedFor: string | string[] | undefined) => {
  if (!forwardedFor) return undefined;
  const value = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  return value.split(",")[0]?.trim() || undefined;
};

// Keyed by client IP only. It used to key on a hash of the Authorization
// header, which is never verified here - so a brute-force script could send a
// random header per request, land in a fresh bucket every time, and never hit
// the login limit. Vercel overwrites x-forwarded-for, so its first hop is the
// real client. NOTE: the store is in-memory, i.e. per serverless instance; for
// a hard guarantee add a Vercel WAF rate-limit rule on /api/v1/auth/*.
const buildRateLimitKey = (req: Request) => {
  const forwardedIp = getFirstForwardedIp(req.headers["x-forwarded-for"]);
  const realIp =
    typeof req.headers["x-real-ip"] === "string"
      ? req.headers["x-real-ip"]
      : undefined;

  return `ip:${forwardedIp || realIp || req.ip || req.socket.remoteAddress || "unknown"}`;
};

const createLimiter = (windowMs: number, max: number, scope: string) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => req.method === "OPTIONS",
    keyGenerator: buildRateLimitKey,
    handler: (_req: Request, res: Response) => {
      res.status(httpStatus.TOO_MANY_REQUESTS).json({
        success: false,
        statusCode: httpStatus.TOO_MANY_REQUESTS,
        message: `Too many ${scope} requests. Please try again later.`,
      });
    },
  });

export const apiRateLimiter = createLimiter(
  config.security.rateLimit.windowMs,
  config.security.rateLimit.max,
  "API"
);

export const authRateLimiter = createLimiter(
  config.security.authRateLimit.windowMs,
  config.security.authRateLimit.max,
  "authentication"
);

// Each question costs 2+ requests against the Gemini quota (free tier: a few
// per minute), so a visitor gets far fewer than the general API budget.
export const aiRateLimiter = createLimiter(60_000, 5, "AI assistant");
