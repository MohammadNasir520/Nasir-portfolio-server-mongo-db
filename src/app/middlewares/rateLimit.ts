import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import httpStatus from "http-status";
import crypto from "crypto";
import config from "../../config";

const getFirstForwardedIp = (forwardedFor: string | string[] | undefined) => {
  if (!forwardedFor) return undefined;
  const value = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  return value.split(",")[0]?.trim() || undefined;
};

const buildRateLimitKey = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")
        .slice(0, 24);
      return `auth:${tokenHash}`;
    }
  }

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
