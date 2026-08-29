import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { SocialLinkController } from "./socialLink.controller";
import { SocialLinkValidation } from "./socialLink.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(SocialLinkValidation.CreateZodSchema),
  SocialLinkController.insertIntoDB
);

router.get("/", SocialLinkController.getAllFromDB);
router.get("/:id", SocialLinkController.getByIdFromDB);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(SocialLinkValidation.updateZodSchema),
  SocialLinkController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  SocialLinkController.deleteFromDB
);

export const SocialLinkRoutes = router;
