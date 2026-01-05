import express from "express";
import { vehicleController } from "./vehicle.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/",logger,auth("admin"), vehicleController.createVehicle);

router.get("/", vehicleController.getAllVehicle);
router.get("/:id", vehicleController.singleVehicle);
router.put("/:id",logger,auth("admin"), vehicleController.updateVehicle);
router.delete("/:id",logger, auth("admin"), vehicleController.deleteVehicle);

export const vehicleRouter = {
  router,
};
