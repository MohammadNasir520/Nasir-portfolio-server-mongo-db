import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UploadsController } from "./uploads.controller";
import { UploadsValidation } from "./uploads.validation";

const router = express.Router();

/**
 * Hands the dashboard a short-lived signature; the browser then POSTs the file
 * straight to Cloudinary. The bytes never touch this API, which is what keeps
 * uploads working under the 1mb express.json limit and the 60s function cap.
 */
router.post(
  "/signature",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(UploadsValidation.signatureZodSchema),
  UploadsController.createUploadSignature
);

export const UploadsRoutes = router;
