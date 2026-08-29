import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { LearningProjectsController } from "./learningProjects.controller";
import { LearningProjectsValidation } from "./learningProjects.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(LearningProjectsValidation.CreateZodSchema),
  LearningProjectsController.insertIntoDB
);

router.get("/", LearningProjectsController.getAllFromDB);
router.get("/:id", LearningProjectsController.getByIdFromDB);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(LearningProjectsValidation.updateZodSchema),
  LearningProjectsController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  LearningProjectsController.deleteFromDB
);

export const LearningProjectsRoutes = router;
