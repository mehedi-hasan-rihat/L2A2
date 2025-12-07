import { pool } from "../../config/database";

const getUserService = async () => {
    // Implementation of user service
    const users = await pool.query("SELECT * FROM users");
    return users;
};

const updateUserService = async (userId: number, data: Record<string, any>) => {
    const allowed = ["name", "email", "phone", "role"];

    const entries = Object.entries(data).filter(([k]) => allowed.includes(k));

    if (entries.length === 0) {
        throw new Error("No valid fields provided for update");
    }

    const fields = entries.map(([k], i) => `${k} = $${i + 1}`).join(", ");
    const values = entries.map(([, v]) => v);

    const result = await pool.query(
        `UPDATE users SET ${fields} WHERE id = $${
            entries.length + 1
        } RETURNING *`,
        [...values, userId]
    );

    const { id, name, email, phone, role } = result.rows[0];

    return {
        id,
        name,
        email,
        phone,
        role,
    };
};

const getUserById = async (userId: number) => {
    const result = await pool.query(
        "SELECT id, name, email, phone, role FROM users WHERE id = $1",
        [userId]
    );
    return result;
};

const deleteUserService = async (userId: number) => {
    const activeBookings = await pool.query(
        "SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'",
        [userId]
    );
    
    if (activeBookings.rows.length > 0) {
        throw new Error("Cannot delete user with active bookings");
    }

    const result = await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    return result;
};

export const UserService = {
    getUserService,
    getUserById,
    updateUserService,
    deleteUserService,
};
