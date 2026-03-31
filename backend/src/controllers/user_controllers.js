import { pool } from "../config/db.js";
import { search_user as search_user_query, add_member as add_member_query } from "../db/queries.js";
import { async_handler } from "../middlewares/async_handler.js";


export const search_users = async_handler(async (req, res) => {
    const { q } = req.query;
    const user_id = req.user_id;
    if (!q) {
        const err = new Error("Query parameter 'q' is required");
        err.code = 400;
        throw err;
    }

    const result = await pool.query(search_user_query, [`%${q}%`, user_id]);
    res.status(200).json({
        success: true,
        data: result.rows
    });
    
});


// TO DO:
// add memeber in group,
// remove member from group,
// leave group,
// promote member to admin,


export const add_member = async_handler(async (req, res) => {
    
});