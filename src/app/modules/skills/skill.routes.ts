import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { SkillsController } from "./skill.controller";
import { SkillsValidation } from "./skill.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(SkillsValidation.CreateZodSchema),
  SkillsController.insertIntoDB
);

router.get("/", SkillsController.getAllFromDB);
router.get("/:id", SkillsController.getByIdFromDB);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(SkillsValidation.updateZodSchema),
  SkillsController.updateIntoDB
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), SkillsController.deleteFromDB);

export const SkillsRoutes = router;
