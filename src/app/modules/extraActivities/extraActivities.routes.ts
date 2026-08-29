import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ExtraActivitiesController } from "./extraActivities.controller";
import { ExtraActivitiesValidation } from "./extraActivities.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ExtraActivitiesValidation.CreateZodSchema),
  ExtraActivitiesController.insertIntoDB
);

router.get("/", ExtraActivitiesController.getAllFromDB);
router.get("/:id", ExtraActivitiesController.getByIdFromDB);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ExtraActivitiesValidation.updateZodSchema),
  ExtraActivitiesController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  ExtraActivitiesController.deleteFromDB
);

export const ExtraActivitiesRoutes = router;
