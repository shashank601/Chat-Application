import { pool } from "../config/db.js";
import { 
    get_room as get_room_query, 
    check_admin as check_admin_query, 
    add_member as add_member_query, 
    leave_group as leave_group_query,
    promote_to_admin as promote_to_admin_query,
    search_user as search_user_query
} from "../db/queries.js";

export const search_users_service = async (q, user_id) => {
    if (!q || !q.trim()) {
        const err = new Error("Query parameter 'q' is required");
        err.code = 400;
        throw err;
    }

    const result = await pool.query(search_user_query, [`%${q}%`, user_id]);
    return result.rows;
}


export const leave_room_service = async (user_id, room_id) => {
    
    if (!room_id) {
        const err = new Error("Room ID is required");
        err.code = 400;
        throw err;
    }

    const { rows: room_exists } = await pool.query(get_room_query, [room_id]);
    if (!room_exists.length || room_exists[0].type !== 'group') {
        const err = new Error("Room not found or is not a group");
        err.code = 404;
        throw err;
    }

    const { rows: result_rows } = await pool.query(leave_group_query, [room_id, user_id]);

    if (!result_rows.length) {
        const err = new Error("Admin cannot leave as the last admin");
        err.code = 403;
        throw err;
    }
    
    return result_rows;
};




export const add_member_to_group_service = async (user_id, room_id, member_id) => {
       
    if (!room_id || !member_id) {
        const err = new Error("Room ID and member ID are required");
        err.code = 400;
        throw err;
    }

    if (user_id === member_id) {
        const err = new Error("You cannot add yourself to a group");
        err.code = 400;
        throw err;
    }

    const {rows: room_exists} = await pool.query(get_room_query, [room_id]);
    if (!room_exists.length || room_exists[0].type !== 'group') {
        const err = new Error("Room not found or is not a group");
        err.code = 404;
        throw err;
    }
    
    const {rows: admin_exists} = await pool.query(check_admin_query, [room_id, user_id]);
    if (!admin_exists.length) {
        const err = new Error("You are not an admin of this room");
        err.code = 403;
        throw err;
    }

    
    let result;
    try {
        const {rows: result_rows} = await pool.query(add_member_query, [room_id, member_id, 'member']);
        result = result_rows;

    } catch (error) {
        if (error.code === '23505') {
            const err = new Error("User already exists in room");
            err.code = 400;
            throw err;
        }

        if (error.code === '23503') {
            const err = new Error("User or room not found");
            err.code = 404;
            throw err;
        }

        throw error;
    }
    
    return result;
}

export const promote_to_admin_service = async (user_id, room_id, member_id) => {
    
    if (!room_id || !member_id) {
        const err = new Error("Room ID and member ID are required");
        err.code = 400;
        throw err;
    }

    if (user_id === member_id) {
        const err = new Error("You cannot promote yourself to admin");
        err.code = 400;
        throw err;
    }

    const {rows: room_exists} = await pool.query(get_room_query, [room_id]);
    if (!room_exists.length || room_exists[0].type !== 'group') {
        const err = new Error("Room not found or is not a group");
        err.code = 404;
        throw err;
    }
    
    const {rows: admin_exists} = await pool.query(check_admin_query, [room_id, user_id]);
    if (!admin_exists.length) {
        const err = new Error("You are not an admin of this room");
        err.code = 403;
        throw err;
    }
    
    
    const {rows: result_rows} = await pool.query(promote_to_admin_query, [room_id, member_id]);
    return result_rows;

}