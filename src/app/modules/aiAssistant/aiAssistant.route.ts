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

// Restores a visitor's earlier conversation when they come back. The session id
// is a random UUID only their browser holds, so it works as the access key.
router.get(
  "/sessions/:sessionId",
  validateRequest(AiAssistantValidation.sessionZodSchema),
  AiAssistantController.getSession
);

export const AiAssistantRoutes = router;
