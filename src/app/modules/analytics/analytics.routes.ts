import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsValidation } from "./analytics.validation";

const router = express.Router();

// Public collectors (the global API rate limiter applies).
router.post("/collect", validateRequest(AnalyticsValidation.collectZodSchema), AnalyticsController.collect);
router.post("/collect/:id/duration", express.text({ type: "*/*", limit: "1kb" }), AnalyticsController.duration);

// Admin reports.
router.get(
  "/summary",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(AnalyticsValidation.rangeZodSchema),
  AnalyticsController.summary
);
router.get("/live", auth(ENUM_USER_ROLE.ADMIN), AnalyticsController.live);
router.get("/sessions/:sessionId", auth(ENUM_USER_ROLE.ADMIN), AnalyticsController.session);

export const AnalyticsRoutes = router;
