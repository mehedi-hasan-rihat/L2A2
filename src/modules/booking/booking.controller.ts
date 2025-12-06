import { Request, Response } from "express";
import { BookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await BookingService.createBookingService(req.body);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getBookings = async (req: Request, res: Response) => {
    try {
        const result = await BookingService.getBookingsService(req.user!.id, req.user!.role);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateBooking = async (req: Request, res: Response) => {
    try {
        if (!req.params.bookingId) {
            throw new Error("Booking id is required");
        }
        const result = await BookingService.updateBookingService(
            parseInt(req.params.bookingId),
            req.user!.id,
            req.user!.role,
            req.body.action
        );
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const BookingController = {
    createBooking,
    getBookings,
    updateBooking
};
