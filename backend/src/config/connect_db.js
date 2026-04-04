import { pool } from "./db.js";

export async function connect_db() {
    try {
        const client = await pool.connect(); 
        console.log("PostgreSQL connected");

        client.release(); 
    } catch (err) {
        console.error("PostgreSQL connection failed", err);
        process.exit(1);
    }
}