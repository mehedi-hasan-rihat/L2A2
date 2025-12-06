import { Pool } from "pg";
import config from ".";

//DB
export const pool = new Pool({
    connectionString: `${config.connection_str}`,
});

const initDB = async () => {
    console.log("Initializing Database...");

    // users table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email TEXT NOT NULL UNIQUE CHECK (email = LOWER(email)),
        password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
        phone TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'customer'))
        )
    `);


    // vehicle table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('car', 'bike', 'van', 'suv')),
        registration_number TEXT NOT NULL UNIQUE,
        daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price >= 0),
        availability_status text NOT NULL CHECK (availability_status IN ('available', 'booked'))
        )
    `);
};

export default initDB;
