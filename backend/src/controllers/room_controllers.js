import { async_handler } from "../middlewares/async_handler.js";
import { 
    create_room_query, 
    check_user_exists as check_user_exists_query, 
    add_member as add_member_query, 
    check_pair_exists, 
    get_my_rooms as get_my_rooms_query, 
    get_room_members as get_room_members_query,
    is_user_in_room as is_user_in_room_query 
} from "../db/queries.js";
import { pool } from "../config/db.js";


export const create_room = async_handler(async (req, res) => {
    
    const { receiver_id } = req.body; 
    const user_id = req.user.id;
    
   
    if (receiver_id) {
        const { rows: [user] } = await pool.query(check_user_exists_query, [receiver_id]);
        
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
        await client.query(add_member_query, [room.room_id, user_id, receiver_id ? 'member' : 'admin']);

        if (receiver_id) {
            await client.query(add_member_query, [room.room_id, receiver_id, 'member']);
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



export const get_my_rooms = async_handler(async (req, res) => {
    const user_id = req.user.id;
    
    const { rows: rooms } = await pool.query(get_my_rooms_query, [user_id]);
    res.status(200).json(rooms);
});


export const get_room_members = async_handler(async (req, res) => {
    const room_id = req.params.room_id;
    const user_id = req.user.id;
    const check_user_in_room = await pool.query(is_user_in_room_query, [room_id, user_id]);
    
    if (check_user_in_room.rows.length === 0) {
        const err = new Error('You are not a member of this room');
        err.statusCode = 403;
        throw err;
    }

    const { rows: members } = await pool.query(get_room_members_query, [room_id]);
    res.status(200).json(members);
});
