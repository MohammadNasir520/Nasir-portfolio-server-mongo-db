import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ExperienceController } from "./experience.controller";
import { ExperienceValidation } from "./experience.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ExperienceValidation.CreateZodSchema),
  ExperienceController.insertIntoDB
);

router.get("/", ExperienceController.getAllFromDB);
router.get("/:id", ExperienceController.getByIdFromDB);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ExperienceValidation.updateZodSchema),
  ExperienceController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  ExperienceController.deleteFromDB
);

export const ExperienceRoutes = router;
