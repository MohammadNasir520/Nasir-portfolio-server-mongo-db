import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { aiRateLimiter } from "../../middlewares/rateLimit";
import { AiAssistantController } from "./aiAssistant.controller";
import { AiAssistantValidation } from "./aiAssistant.validation";
import promptSecurityCheck from "../../middlewares/aiAssistantMiddlWare";

const router = express.Router();

// Public - visitors ask questions from the site. Rate limited because every
// question costs 2+ model requests against the Gemini quota.
router.post(
  "/",
  aiRateLimiter,
  promptSecurityCheck,
  validateRequest(AiAssistantValidation.askZodSchema),
  AiAssistantController.ask
);

export const AiAssistantRoutes = router;
