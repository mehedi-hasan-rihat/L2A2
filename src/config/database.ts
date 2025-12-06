import { Pool } from "pg";
import config from ".";

//DB
export const pool = new Pool({
    connectionString: `${config.connection_str}`,
});

const initDB = async () => {
    console.log("Initializing Database...");
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
};

export default initDB;
