import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const parseNumber = (value: string | undefined, fallback: number, min = 1) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.floor(parsed));
};

const corsOrigins = (
  process.env.CORS_ORIGINS || "http://localhost:3000,https://mdnasir-uddin.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 12,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN || "365d",
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "365d",
  },
  security: {
    corsOrigins,
    maxBodySize: process.env.MAX_BODY_SIZE || "1mb",
    trustProxy: process.env.TRUST_PROXY === "true",
    rateLimit: {
      windowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 60_000, 1000),
      max: parseNumber(process.env.RATE_LIMIT_MAX, 120, 1),
    },
    authRateLimit: {
      windowMs: parseNumber(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 60_000, 1000),
      max: parseNumber(process.env.AUTH_RATE_LIMIT_MAX, 20, 1),
    },
  },
};
