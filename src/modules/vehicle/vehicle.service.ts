import { pool } from "../../config/database";

const createVehicleService = async (payload: Record<string, any>) => {
  // Vehicle service logic here

  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const result = await pool.query(
    "INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );

  console.log(result, "vehicle data from service");
  return result.rows[0];
}

export const VehicleService = {
  createVehicleService,
};