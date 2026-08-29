import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(AdminValidation.CreateAdminZodSchema),
  AdminController.insertIntoDB
);

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.getAllFromDB
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.getByIdFromDB
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(AdminValidation.UpdateSchema),
  AdminController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.deleteFromDB
);

export const AdminRoutes = router;
