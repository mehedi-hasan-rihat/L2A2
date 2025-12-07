import { pool } from "../../config/database";

const createBookingService = async (payload: Record<string, any>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const vehicle = await pool.query(
        "SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1",
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

    if (duration <= 0) {
        throw new Error("End date must be after start date");
    }

    const totalPrice = vehicle.rows[0].daily_rent_price * duration;

    const booking = await pool.query(
        "INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            totalPrice,
            "active",
        ]
    );

    await pool.query(
        "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
        [vehicle_id]
    );
    return {
        ...booking.rows[0],
        vehicle: {
            vehicle_name: vehicle.rows[0].vehicle_name,
            daily_rent_price: vehicle.rows[0].daily_rent_price,
        },
    };
};

const getBookingsService = async (userId: number, role: string) => {
    const customerQuery = `
        SELECT 
            b.id,
            b.customer_id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,
            v.vehicle_name,
            v.registration_number,
            v.type
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
    `;

    const adminQuery = `
        SELECT 
            b.id,
            b.customer_id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,
            u.name AS customer_name,
            u.email AS customer_email,
            v.vehicle_name,
            v.registration_number
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN vehicles v ON b.vehicle_id = v.id
    `;

    const result = role === "admin"
        ? await pool.query(adminQuery)
        : await pool.query(customerQuery, [userId]);

    return result.rows.map((row) => {
        const booking: any = {
            id: row.id,
            customer_id: row.customer_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
            },
        };
        if (role === "admin") {
            booking.customer = {
                name: row.customer_name,
                email: row.customer_email,
            };
        } else {
            booking.vehicle.type = row.type;
        }
        return booking;
    });
};

const updateBookingService = async (
    bookingId: number,
    userId: number,
    role: string,
    action: string
) => {
    const booking = await pool.query("SELECT * FROM bookings WHERE id = $1", [
        bookingId,
    ]);

    if (!booking.rows[0]) {
        throw new Error("Booking not found");
    }

    if (role === "customer") {
        if (booking.rows[0].customer_id !== userId) {
            throw new Error("Unauthorized");
        }
        if (new Date() >= new Date(booking.rows[0].rent_start_date)) {
            throw new Error("Cannot cancel booking after start date");
        }
        await pool.query(
            "UPDATE bookings SET status = 'cancelled' WHERE id = $1",
            [bookingId]
        );
        await pool.query(
            "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
            [booking.rows[0].vehicle_id]
        );
        return { message: "Booking cancelled" };
    }

    if (role === "admin") {
        await pool.query(
            "UPDATE bookings SET status = 'returned' WHERE id = $1",
            [bookingId]
        );
        await pool.query(
            "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
            [booking.rows[0].vehicle_id]
        );
        return { message: "Booking marked as returned" };
    }
};

export const BookingService = {
    createBookingService,
    getBookingsService,
    updateBookingService,
};
