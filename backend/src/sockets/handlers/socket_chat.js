import { 
    is_user_in_room, 
    add_message, 
    delete_message, 
    clear_room 
} from "../../db/queries.js";
import { pool } from "../../config/db.js";


export const socket_chat = (socket) => {
    
    const user_id = socket.user_id;

    socket.on("join_room", async (room_id) => {
        if (!room_id || typeof room_id !== "string") return;

        try {
            const { rows: [row] } = await pool.query(is_user_in_room, [user_id, room_id]);
            
            if (!row) {
                return socket.emit("error", { type: "join_room", message: "Not allowed in this room" });
            }
            socket.join(room_id);
        } catch (error) {
            return socket.emit("error", { type: "join_room", message: "Server error" });
        }
    });

    
    socket.on("send_message", async (room_id, msg) => {
        
        if (
            !room_id || 
            typeof room_id !== "string" ||
            !msg || 
            msg.trim().length === 0
        ) {
            return socket.emit("error", { type: "send_message", message: "Invalid message" });
        }
        
        try {
           const { rows: message_id } = await pool.query(add_message_query, [room_id, user_id, msg]);
           
           io.to(room_id).emit("receive_message", message_id[0]);
            
        } catch (error) {
            return socket.emit("error", {type: "send_message", message: "Server error"});
        }
        
    });

    socket.on("delete_message", async (message_id) => {
        try {
            const { rows: message } = await pool.query(delete_message, [message_id, user_id]);

            if (message.length === 0) {
                return socket.emit("error", {type: "delete_message", message: "Message not found"});
            }

            io.to(room_id).emit("message_deleted", message_id[0]);
            
        } catch (error) {
            return socket.emit("error", {type: "delete_message", message: "Server error"});
        }
    });


    socket.on("clear_room", async () => {
        try {
            
            const { rows: [row] } = await pool.query(is_user_in_room, [user_id, room_id]);
            
            if (!row) {
                return socket.emit("error", { type: "join_room", message: "Not allowed in this room" });
            }

            const { rows: messages } = await pool.query(clear_room, [room_id]);
            
            io.to(room_id).emit("room_cleared", messages);
            
        } catch (error) {
            return socket.emit("error", {type: "clear_room", message: "Server error"});
        }
    });
}

