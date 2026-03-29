//========[auth]========
export const register = `
    INSERT INTO users (username, email, pwd)
    VALUES ($1, $2, $3)
    RETURNING user_id, username, email;
`;

export const login = `
    SELECT user_id, username, email, pwd
    FROM users
    WHERE email = $1;
`;

//========[ room ]========
export const create_room = `
    INSERT INTO rooms (type, room_name)
    VALUES ($1, $2)
    RETURNING room_id;
`

export const delete_direct_room = `
    DELETE FROM rooms
    WHERE room_id = $1 AND type = 'direct'
    RETURNING room_id;
`

export const delete_group_room = `
    DELETE FROM rooms
    WHERE room_id = $1 AND type = 'group'
    RETURNING room_id;
`



export const add_member = `
    INSERT INTO members (room_id, user_id, role) 
    VALUES ($1, $2, $3)
    RETURNING room_id, user_id, role;
`


export const leave_room = `
    WITH group_room AS (        -- if room type is direct, then result will be empty 
        SELECT room_id
        FROM rooms
        WHERE room_id = $1
        AND type = 'group'
    ),
    admin_count AS (
        SELECT COUNT(*) AS cnt
        FROM members
        WHERE room_id = $1
        AND role = 'admin'
    )
    DELETE FROM members m
    
    USING group_room, admin_count

    WHERE m.room_id = group_room.room_id
    AND m.user_id = $2
    AND (
            m.role != 'admin'
        OR (m.role = 'admin' AND admin_count.cnt > 1)
    )
    RETURNING user_id;
`

export const is_user_in_room = `
    SELECT 1
    FROM members
    WHERE room_id = $1 AND user_id = $2;
`

export const get_room_members = `   -- only allow if user is a member of the room
    SELECT user_id, role
    FROM members
    WHERE room_id = $1;
`

export const promote_to_admin = `
    UPDATE members m
    SET role = 'admin'
    WHERE m.room_id = $1
    AND m.user_id = $2
    RETURNING user_id;
`

// export const check_room_type = `      DB will enforce rule, no pre-check in backend
//     SELECT type 
//     FROM rooms 
//     WHERE room_id = $1;
// `


// export const check_role = `       instead of checking role on each add member request, we will assign role using jwt token
//     SELECT role 
//     FROM room_members 
//     WHERE room_id = $1 AND user_id = $2;
// `


//========[ sidebar ]========

export const get_my_rooms = `
    SELECT 
        m.room_id,
        CASE 
            WHEN r.type = 'direct' THEN u.username
            ELSE r.room_name
        END AS display_name,
        r.type,
        r.last_msg_ref,
        m.role,
        msg.content AS last_msg,
        msg.created_at AS last_msg_at
    FROM members m
    JOIN rooms r 
        ON m.room_id = r.room_id

    LEFT JOIN messages msg 
        ON r.last_msg_ref = msg.msg_id

    LEFT JOIN members dm 
        ON r.type = 'direct' 
        AND dm.room_id = r.room_id 
        AND dm.user_id != $1

    LEFT JOIN users u 
        ON dm.user_id = u.user_id

    WHERE m.user_id = $1
    ORDER BY msg.created_at DESC NULLS LAST;
`

//========[ messages ]========
export const get_messages = `
    SELECT 
        m.msg_id,
        m.room_id,
        u.username AS sender_name,
        m.content,
        m.created_at,
        m.updated_at
    FROM messages m
    JOIN users u ON m.sender_id = u.user_id
    WHERE m.room_id = $1 AND m.is_deleted = FALSE
    ORDER BY m.created_at ASC;
`

export const add_message = `
    WITH new_msg AS (
        INSERT INTO messages (room_id, sender_id, content)
        VALUES ($1, $2, $3)
        RETURNING msg_id
    )
    UPDATE rooms
    SET last_msg_ref = new_msg.msg_id       
    FROM new_msg
    WHERE rooms.room_id = $1
    RETURNING new_msg.msg_id;
`


export const delete_message = `
    UPDATE messages
    SET is_deleted = TRUE
    WHERE msg_id = $1 AND sender_id = $2
    RETURNING msg_id;
`

export const clear_room = `
    DELETE FROM messages
    WHERE room_id = $1
    RETURNING msg_id;
`