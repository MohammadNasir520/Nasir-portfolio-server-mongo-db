import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AboutController } from "./about.controller";
import { AboutValidation } from "./about.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(AboutValidation.CreateZodSchema),
  AboutController.insertIntoDB
);

router.get("/", AboutController.getAllFromDB);
router.get("/:id", AboutController.getByIdFromDB);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(AboutValidation.updateZodSchema),
  AboutController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  AboutController.deleteFromDB
);

export const AboutRoutes = router;
