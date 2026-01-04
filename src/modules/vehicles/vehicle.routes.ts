import express from "express";
import { vehicleController } from "./vehicle.controller";

const router = express.Router();

router.post("/", vehicleController.createVehicle);

router.get("/", vehicleController.getAllVehicle);
router.get("/:id", vehicleController.singleVehicle);
router.put("/:id", vehicleController.updateVehicle);
router.delete("/:id", vehicleController.deleteVehicle);

export const vehicleRouter = {
  router,
};
