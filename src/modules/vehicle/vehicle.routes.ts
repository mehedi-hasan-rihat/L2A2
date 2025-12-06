import { Router } from "express";
import { VehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";

const vehicleRoutes = Router();

// Define vehicle-related routes here
vehicleRoutes.post("/", auth("admin"), VehicleController.createVehicle);
vehicleRoutes.get("/", auth("admin"), VehicleController.vehicleList);

export default vehicleRoutes;