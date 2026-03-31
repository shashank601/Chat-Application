import { async_handler } from "../middlewares/async_handler.js";
import { pool } from "../config/db.js";
import { is_user_in_room as is_user_in_room_query, get_messages as get_messages_query } from "../db/queries.js";

export const get_messages = async_handler(async (req, res) => {
    const room_id = req.params.room_id;
    const user_id = req.user.id;
    if (!room_id) {
        const err = new Error('Room ID is required');
        err.code = 400;
        throw err;
    }
    
    const { rows: is_user_in_room } = await pool.query(is_user_in_room_query, [room_id, user_id]);

    if (is_user_in_room.length === 0) {
        const err = new Error('You are not a member of this room');
        err.code = 403;
        throw err;
    }
    
    const { rows: messages } = await pool.query(get_messages_query, [room_id]);
    res.status(200).json(messages);
});