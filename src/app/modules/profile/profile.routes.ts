import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ProfileController } from "./profile.controller";
import { ProfileValidation } from "./profile.validation";

const router = express.Router();

const anyLoggedIn = auth(
  ENUM_USER_ROLE.ADMIN,
  ENUM_USER_ROLE.SUPER_ADMIN,
  ENUM_USER_ROLE.USER
);

router.get("/", anyLoggedIn, ProfileController.getAllFromDB);

router.patch(
  "/",
  anyLoggedIn,
  validateRequest(ProfileValidation.updateZodSchema),
  ProfileController.updateByIdFromDB
);

router.patch(
  "/password",
  anyLoggedIn,
  validateRequest(ProfileValidation.changePasswordZodSchema),
  ProfileController.changePassword
);

export const ProfileRoutes = router;
