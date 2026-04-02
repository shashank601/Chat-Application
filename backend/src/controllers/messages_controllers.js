import { async_handler } from "../middlewares/async_handler.js";
import { pool } from "../config/db.js";
import { 
    is_user_in_room as is_user_in_room_query, 
    get_messages as get_messages_query, 
    add_message as add_message_query, 
    delete_message as delete_message_query, 
    clear_room as clear_room_query 
} from "../db/queries.js";

export const get_messages = async_handler(async (req, res) => {
    const room_id = req.params.room_id;
    const user_id = req.user_id;
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



export const add_message = async_handler(async (req, res) => {
    const room_id = req.params.room_id;
    const sender_id = req.user_id;
    const { content } = req.body;
    
    if (!room_id || !sender_id || !content) {
        const err = new Error('Room ID, User ID and content are required');
        err.code = 400;
        throw err;
    }
    
    const { rows: is_user_in_room } = await pool.query(is_user_in_room_query, [room_id, sender_id]);

    if (is_user_in_room.length === 0) {
        const err = new Error('You are not a member of this room');
        err.code = 403;
        throw err;
    }
    
    const { rows: message_id } = await pool.query(add_message_query, [room_id, sender_id, content]);
    res.status(201).json(message_id);
});


export const delete_message = async_handler(async (req, res) => {
    const message_id = req.params.message_id;
    const user_id = req.user_id;
    
    if (!message_id || !user_id) {
        const err = new Error('Message ID and User ID are required');
        err.code = 400;
        throw err;
    }
    
    const { rows: message } = await pool.query(delete_message_query, [message_id, user_id]);
    
    if (message.length === 0) {
        const err = new Error('Message not found or you are not the sender');
        err.code = 404;
        throw err;
    }
    
    res.status(200).json({ message: 'Message deleted successfully' });
});


export const clear_room = async_handler(async (req, res) => {
    const room_id = req.params.room_id;
    const user_id = req.user_id;
    
    if (!room_id || !user_id) {
        const err = new Error('Room ID and User ID are required');
        err.code = 400;
        throw err;
    }
    
    const { rows: is_user_in_room } = await pool.query(is_user_in_room_query, [room_id, user_id]);
    
    if (is_user_in_room.length === 0) {
        const err = new Error('You are not a member of this room');
        err.code = 403;
        throw err;
    }
    
    const { rows: messages } = await pool.query(clear_room_query, [room_id]);
  
    
    res.status(200).json({ message: 'Room cleared successfully' });
});