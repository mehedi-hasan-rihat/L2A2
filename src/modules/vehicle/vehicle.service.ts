import { pool } from "../../config/database";

const createVehicleService = async (payload: Record<string, any>) => {
    // Vehicle service logic here

    const {
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
    } = payload;

    const result = await pool.query(
        "INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status,
        ]
    );

    console.log(result, "vehicle data from service");
    return result.rows[0];
};

const vehicleListService = async () => {
    const result = await pool.query("SELECT * FROM vehicles");
    return result.rows;
};

const getVehicleByIdService = async (vehicleId: string) => {
    const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
        vehicleId,
    ]);
    return result.rows[0];
};

const updateVehicleService = async (vehicleId: string, updateData: Record<string, any>) => {
    const allowedFields = ['vehicle_name', 'type', 'registration_number', 'daily_rent_price', 'availability_status'];
    
    const fieldsToUpdate = Object.keys(updateData);
    if (fieldsToUpdate.length === 0) {
        throw new Error("No fields provided to update");
    }

    const invalidFields = fieldsToUpdate.filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
    }

    const setClause = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`).join(", ");
    
    const updateValues = Object.values(updateData);
    updateValues.push(vehicleId);

    const result = await pool.query(
        `UPDATE vehicles SET ${setClause} WHERE id = $${updateValues.length} RETURNING *`,
        updateValues
    );

    return result.rows[0];
};

const deleteVehicleService = async (vehicleId: string) => {
    const activeBookings = await pool.query(
        "SELECT id FROM bookings WHERE vehicle_id = $1 AND status = 'active'",
        [vehicleId]
    );
    
    if (activeBookings.rows.length > 0) {
        throw new Error("Cannot delete vehicle with active bookings");
    }

    const result = await pool.query("DELETE FROM vehicles WHERE id = $1 RETURNING *", [vehicleId]);
    return result.rows[0];
}


export const VehicleService = {
    createVehicleService,
    vehicleListService,
    getVehicleByIdService,
    updateVehicleService,
    deleteVehicleService
};
