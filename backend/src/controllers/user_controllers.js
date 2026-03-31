import { pool } from "../config/db.js";
import { search_user as search_user_query } from "../db/queries.js";
import { async_handler } from "../middlewares/async_handler.js";


export const search_users = async_handler(async (req, res) => {
    const { q } = req.query;
    if (!q) {
        const err = new Error("Query parameter 'q' is required");
        err.statusCode = 400;
        throw err;
    }

    const result = await pool.query(search_user_query, [`%${q}%`]);
    res.status(200).json({
        success: true,
        data: result.rows
    });
    
});