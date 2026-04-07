import { pool } from '../config/db.js';
import { 
    create_room as create_room_query, 
    check_user_exists as check_user_exists_query, 
    add_member as add_member_query, 
    check_pair_exists, 
    get_my_rooms as get_my_rooms_query, 
    get_room_members as get_room_members_query,
    is_user_in_room as is_user_in_room_query,
    delete_direct_room as delete_direct_room_query,
    delete_group_room as delete_group_room_query,
    get_room as get_room_query,
    check_admin as check_admin_query
} from "../db/queries.js";


export const create_room_service = async (receiver_id, group_name, user_id) => {
        
    if (receiver_id) {
        const { rows: [user] } = await pool.query(check_user_exists_query, [receiver_id]);
        
        if (!user) {
            const err = new Error('User not found');
            err.code = 404;
            throw err;
        }

        const { rows: [existing_pair] } = await pool.query(check_pair_exists, [user_id, receiver_id]);
        
        if (existing_pair) {
            const { rows: [existing_room] } = await pool.query(get_room_query, [existing_pair.room_id]);

            return existing_room ?? existing_pair;
        }
    }

    if (!receiver_id && !group_name) {
        const err = new Error('Group name is required for group chat');
        err.code = 400;
        throw err;
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const roomType = receiver_id ? 'direct' : 'group';
        const { rows: [room] } = await client.query(create_room_query, [roomType, receiver_id ? null : group_name]);

        // Add creator
        await client.query(add_member_query, [room.room_id, user_id, receiver_id ? 'member' : 'admin']);

        if (receiver_id) {
            await client.query(add_member_query, [room.room_id, receiver_id, 'member']);
        }

        await client.query('COMMIT');
        return room;

    } catch (err) {
        await client.query('ROLLBACK');
        err.code = 500;
        err.message = 'Failed to create room';
        throw err; 
    } finally {
        client.release();
    }
};


export const delete_room_service = async (room_id, user_id) => {
        
    if (!room_id) {
        const err = new Error('Room ID is required');
        err.code = 400;
        throw err;
    }

    const { rows: [member] } = await pool.query(is_user_in_room_query, [room_id, user_id]);

    if (!member) {
        const err = new Error('You are not a member of this room');
        err.code = 403;
        throw err;
    }
    const { rows: [room] } = await pool.query(get_room_query, [room_id]);
    if (!room) {
        const err = new Error('Room not found');
        err.code = 404;
        throw err;
    }
    
    if (room.type === 'direct') {

        await pool.query(delete_direct_room_query, [room_id]);
        
    } else {
        const { rows: admin_row} = await pool.query(check_admin_query, [room_id, user_id]);
        if (admin_row.length === 0) {
            const err = new Error('Only admins can delete group rooms');
            err.code = 403;
            throw err;
        }
        
        await pool.query(delete_group_room_query, [room_id]);
    }
};

export const get_my_rooms_service = async (user_id) => {
    const { rows: rooms } = await pool.query(get_my_rooms_query, [user_id]);
    return rooms;
};

export const get_room_members_service = async (room_id, user_id) => {

    const check_user_in_room = await pool.query(is_user_in_room_query, [room_id, user_id]);
    
    if (check_user_in_room.rows.length === 0) {
        const err = new Error('You are not a member of this room');
        err.code = 403;
        throw err;
    }

    const { rows: members } = await pool.query(get_room_members_query, [room_id]);
    return members;
}

export const is_user_in_room_service = async (room_id, user_id) => {
    
    const result = await pool.query(is_user_in_room_query, [room_id, user_id]);
    return result.rows[0] || null;
}