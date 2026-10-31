import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TravelMapController } from "./travelMap.controller";
import { TravelMapValidation } from "./travelMap.validation";

const router = express.Router();

// Any signed-in account; each user only ever reads and writes their own map.
const anyLoggedIn = auth(
  ENUM_USER_ROLE.ADMIN,
  ENUM_USER_ROLE.SUPER_ADMIN,
  ENUM_USER_ROLE.USER
);

router.get("/me", anyLoggedIn, TravelMapController.getMine);

router.put(
  "/me",
  anyLoggedIn,
  validateRequest(TravelMapValidation.saveZodSchema),
  TravelMapController.saveMine
);

export const TravelMapRoutes = router;
