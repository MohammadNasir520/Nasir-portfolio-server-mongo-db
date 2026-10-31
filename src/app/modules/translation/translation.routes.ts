import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TranslationController } from "./translation.controller";
import { TranslationValidation } from "./translation.validation";

const router = express.Router();

// Public: the site needs these to render. ?lang=bn&route=travel narrow it.
router.get("/", TranslationController.getAll);

router.put(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(TranslationValidation.upsertZodSchema),
  TranslationController.upsert
);

export const TranslationRoutes = router;
