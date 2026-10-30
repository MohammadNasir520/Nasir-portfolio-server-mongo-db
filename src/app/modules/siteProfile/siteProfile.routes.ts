import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { SiteProfileController } from "./siteProfile.controller";
import { SiteProfileValidation } from "./siteProfile.validation";

const router = express.Router();

/**
 * Singleton: no POST, no DELETE, no /:id. The absence of a create route is what
 * structurally prevents the "a second banner document silently breaks the site"
 * bug the old banner/socialLink modules allowed.
 */
router.get("/", SiteProfileController.getSiteProfile);

router.patch(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(SiteProfileValidation.updateZodSchema),
  SiteProfileController.updateSiteProfile
);

export const SiteProfileRoutes = router;
