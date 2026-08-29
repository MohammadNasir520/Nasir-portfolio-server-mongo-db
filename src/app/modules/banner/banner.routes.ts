import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BannerController } from "./banner.controller";
import { BannerValidation } from "./banner.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BannerValidation.CreateZodSchema),
  BannerController.insertIntoDB
);

router.get("/", BannerController.getAllFromDB);
router.get("/:id", BannerController.getByIdFromDB);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BannerValidation.updateZodSchema),
  BannerController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  BannerController.deleteFromDB
);

export const BannerRoutes = router;
