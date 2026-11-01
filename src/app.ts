import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import httpStatus from "http-status";
import config from "./config";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { apiRateLimiter } from "./app/middlewares/rateLimit";
import routes from "./app/routes";

const app: Application = express();

app.disable("x-powered-by");
app.set("trust proxy", config.security.trustProxy);

const allowedOrigins = new Set(config.security.corsOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin/server-to-server requests, which send no Origin header.
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: config.security.maxBodySize }));
app.use(express.urlencoded({ extended: true, limit: config.security.maxBodySize }));
app.use(mongoSanitize());
// `technology` is a legitimate repeated query param (Prisma's hasSome), so it
// must survive HPP's collapse-to-last-value protection.
app.use(hpp({ whitelist: ["technology"] }));
app.use(cookieParser());

app.use("/api/v1", apiRateLimiter, routes);

app.get("/", (_req: Request, res: Response) => {
  res.send("portfolio server is running");
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({ success: true, status: "ok" });
});

// 404 — must sit before the error handler so unmatched routes fall through here.
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

app.use(globalErrorHandler);

export default app;
