import { Request, Response } from "express";
import { VehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
    // Controller logic for vehicle management

    try {
        const result = await VehicleService.createVehicleService(req.body);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result,
        });
    } catch (err: any) {
        console.log(err, "error from vehicle controller");
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const vehicleList = async (req: Request, res: Response) => {
    try {
        const result = await VehicleService.vehicleListService();
        res.status(200).json({
            success: true,
            message: "Vehicle list fetched successfully",
            data: result,
        });
    } catch (err: any) {
        console.log(err, "error from vehicle controller");
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const VehicleController = {
    createVehicle,
    vehicleList
};
