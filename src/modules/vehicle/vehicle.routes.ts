import { Router } from "express";
import { VehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";

const vehicleRoutes = Router();

// Define vehicle-related routes here
vehicleRoutes.post("/", auth("admin"), VehicleController.createVehicle);
vehicleRoutes.get("/", auth("admin", "customer"), VehicleController.vehicleList);
vehicleRoutes.get("/:vehicleId", auth("admin", "customer"), VehicleController.getVehicleById);
vehicleRoutes.put("/:vehicleId", auth("admin"), VehicleController.updateVehicle);
vehicleRoutes.delete("/:vehicleId", auth("admin"), VehicleController.deleteVehicle);

export default vehicleRoutes;