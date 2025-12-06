import { pool } from "../../config/database";

const createBookingService = async (payload: Record<string, any>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const vehicle = await pool.query(
        "SELECT id, daily_rent_price, availability_status FROM vehicles WHERE id = $1",
        [vehicle_id]
    );

    if (!vehicle.rows[0]) {
        throw new Error("Vehicle not found");
    }

    if (vehicle.rows[0].availability_status !== "available") {
        throw new Error("Vehicle is not available for booking");
    }

    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);
    const duration = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    console.log("Duration:", duration);

    if (duration <= 0) {
        throw new Error("End date must be after start date");
    }

    const totalPrice = vehicle.rows[0].daily_rent_price * duration;
    
    const booking = await pool.query(
        "INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, 'active']
    );

    await pool.query(
        "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
        [vehicle_id]
    );
    return booking.rows[0];
};

const getBookingsService = async (userId: number, role: string) => {
    if (role === 'admin') {
        const result = await pool.query("SELECT * FROM bookings");
        return result.rows;
    }
    const result = await pool.query("SELECT * FROM bookings WHERE customer_id = $1", [userId]);
    return result.rows;
};

const updateBookingService = async (bookingId: number, userId: number, role: string, action: string) => {
    const booking = await pool.query("SELECT * FROM bookings WHERE id = $1", [bookingId]);
    
    if (!booking.rows[0]) {
        throw new Error("Booking not found");
    }

    if (role === 'customer') {
        if (booking.rows[0].customer_id !== userId) {
            throw new Error("Unauthorized");
        }
        if (new Date() >= new Date(booking.rows[0].rent_start_date)) {
            throw new Error("Cannot cancel booking after start date");
        }
        await pool.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [bookingId]);
        await pool.query("UPDATE vehicles SET availability_status = 'available' WHERE id = $1", [booking.rows[0].vehicle_id]);
        return { message: "Booking cancelled" };
    }

    if (role === 'admin') {
        await pool.query("UPDATE bookings SET status = 'returned' WHERE id = $1", [bookingId]);
        await pool.query("UPDATE vehicles SET availability_status = 'available' WHERE id = $1", [booking.rows[0].vehicle_id]);
        return { message: "Booking marked as returned" };
    }
};

const autoReturnExpiredBookings = async () => {
    const result = await pool.query(
        "UPDATE bookings SET status = 'returned' WHERE status = 'active' AND rent_end_date < CURRENT_DATE RETURNING vehicle_id"
    );
    
    for (const row of result.rows) {
        await pool.query("UPDATE vehicles SET availability_status = 'available' WHERE id = $1", [row.vehicle_id]);
    }
};

export const BookingService = {
    createBookingService,
    getBookingsService,
    updateBookingService,
    autoReturnExpiredBookings,
};
