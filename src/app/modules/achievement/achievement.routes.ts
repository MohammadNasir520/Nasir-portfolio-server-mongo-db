import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AchievementController } from "./achievement.controller";
import { AchievementValidation } from "./achievement.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(AchievementValidation.CreateZodSchema),
  AchievementController.insertIntoDB
);

router.get("/", AchievementController.getAllFromDB);
router.get("/:id", AchievementController.getByIdFromDB);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(AchievementValidation.updateZodSchema),
  AchievementController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  AchievementController.deleteFromDB
);

export const AchievementRoutes = router;
