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

const getVehicleById = async (req: Request, res: Response) => { 
    // Controller logic to get vehicle by ID
    try {
        const vehicleId = req.params.vehicleId;
        console.log(vehicleId, "vehicleId");

        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Vehicle ID is required",
            });
        }

        const result = await VehicleService.getVehicleByIdService(vehicleId);
        res.status(200).json({
            success: true,
            message: "Vehicle fetched successfully",
            data: result,
        });
    } catch (err: any) {
        console.log(err, "error from vehicle controller");
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    // Controller logic to update vehicle details
    try {
        const vehicleId = req.params.vehicleId;
        const updateData = req.body;    
        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Vehicle ID is required",
            });
        }
        const result = await VehicleService.updateVehicleService(vehicleId, updateData);
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result,
        });
    } catch (err: any) {    
        console.log(err, "error from vehicle controller");
        res.status(500).json({
            success: false, 
            message: err.message,
        });
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    // Controller logic to delete a vehicle
    try {
        const vehicleId = req.params.vehicleId;
        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Vehicle ID is required",
            });
        }
        // Assuming a deleteVehicleService exists in VehicleService
        await VehicleService.deleteVehicleService(vehicleId);
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
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
    vehicleList,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};
