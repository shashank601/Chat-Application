import { async_handler } from "../middlewares/async_handler.js";
import { create_room_query, check_user_exists, add_member, check_pair_exists } from "../db/queries.js";
import { pool } from "../config/db.js";


export const create_room = async_handler(async (req, res) => {
    
    const { receiver_id } = req.body; 
    const user_id = req.user.id;
    
   
    if (receiver_id) {
        const { rows: [user] } = await pool.query(check_user_exists, [receiver_id]);
        
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }

        const { rows: [existingPair] } = await pool.query(check_pair_exists, [user_id, receiver_id]);
        if (existingPair) {
            return res.status(200).json(existingPair);
        }
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const roomType = receiver_id ? 'direct' : 'group';
        const { rows: [room] } = await client.query(create_room_query, [roomType, null]);

        // Add creator
        await client.query(add_member, [room.room_id, user_id, receiver_id ? 'member' : 'admin']);

        if (receiver_id) {
            await client.query(add_member, [room.room_id, receiver_id, 'member']);
        }

        await client.query('COMMIT');
        res.status(201).json(room);

    } catch (err) {
        await client.query('ROLLBACK');
        err.statusCode = 500;
        err.message = 'Failed to create room';
        throw err; 
    } finally {
        client.release();
    }
});


