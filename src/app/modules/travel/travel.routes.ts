import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TravelController } from "./travel.controller";
import { TravelValidation } from "./travel.validation";

const router = express.Router();

// Static segments must be declared before "/places/:id" so they are not
// swallowed by the id param.
router.get("/districts", TravelController.getDistricts);
router.get("/stats", TravelController.getStats);

router.get("/overview", TravelController.getOverview);
router.patch(
  "/overview",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(TravelValidation.overviewZodSchema),
  TravelController.updateOverview
);

router.post(
  "/places",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(TravelValidation.CreateZodSchema),
  TravelController.insertIntoDB
);
router.get("/places", TravelController.getAllFromDB);
router.get("/places/:id", TravelController.getByIdFromDB);
// Public: a visitor opening a place page. Deduplicated per visitor in the
// controller; the global API rate limiter still applies.
router.post("/places/:id/view", TravelController.recordView);
router.patch(
  "/places/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(TravelValidation.updateZodSchema),
  TravelController.updateIntoDB
);
router.delete(
  "/places/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  TravelController.deleteFromDB
);

export const TravelRoutes = router;
