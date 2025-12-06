import { Router } from "express";
import { BookingController } from "./booking.controller";
import auth  from "../../middleware/auth";

const bookingRoutes = Router();

bookingRoutes.post("/", auth("admin", "customer"), BookingController.createBooking);
bookingRoutes.get("/", auth("admin", "customer"), BookingController.getBookings);
bookingRoutes.put("/:bookingId", auth("admin", "customer"), BookingController.updateBooking);

export default bookingRoutes;
