import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BlogController } from "./blog.controller";
import { BlogValidation } from "./blog.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BlogValidation.CreateZodSchema),
  BlogController.insertIntoDB
);

router.get("/", BlogController.getAllFromDB);
router.get("/:id", BlogController.getByIdFromDB);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BlogValidation.updateZodSchema),
  BlogController.updateIntoDB
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), BlogController.deleteFromDB);

export const BlogRoutes = router;
