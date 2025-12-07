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
        res.status(400).json({
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
            message: result.length === 0 ? "No vehicles found" : "Vehicles retrieved successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const getVehicleById = async (req: Request, res: Response) => {
    try {

        if(!req.params.vehicleId){
            return  res.status(400).json({ success: false, message: 'Vehicle ID is required' });
        }

        const result = await VehicleService.getVehicleByIdService(req.params.vehicleId);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    try {

        if(!req.params.vehicleId){
            return  res.status(400).json({ success: false, message: 'Vehicle ID is required' });
        }

        const result = await VehicleService.updateVehicleService(req.params.vehicleId, req.body);
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(400).json({
            success: false, 
            message: err.message,
        });
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    try {

        if(!req.params.vehicleId){
            return  res.status(400).json({ success: false, message: 'Vehicle ID is required' });
        }

        await VehicleService.deleteVehicleService(req.params.vehicleId);
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });
    } catch (err: any) {
        res.status(400).json({
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
