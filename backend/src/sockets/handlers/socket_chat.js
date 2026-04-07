import { pool } from "../../config/db.js";
import { 
    delete_message_service, 
    clear_room_service, 
    add_message_service 
} from "../../services/messages_service.js";
import { 
    is_user_in_room_service 
} from "../../services/room_services.js";
import { 
    leave_room_service 
} from "../../services/user_service.js";







export const socket_chat = (socket) => {
    
    const user_id = socket.user_id;

    socket.on("join_room", async (room_id) => {
        if (!room_id || typeof room_id !== "string") return;

        try {
            const row = await is_user_in_room_service(room_id, user_id);
            
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
           const message_id = await add_message_service(room_id, user_id, msg);
           
           // emit to all users in the room
           io.in(room_id).emit("receive_message", message_id[0]);
            
        } catch (error) {
            return socket.emit("error", {type: "send_message", message: "Server error"});
        }
        
    });

    socket.on("delete_message", async (room_id, message_id) => {
        try {
            const is_user_in_room = await is_user_in_room_service(room_id, user_id);
            
            if (!is_user_in_room) {
                return socket.emit("error", {type: "delete_message", message: "Not allowed in this room"});
            }

            let message = await delete_message_service(message_id, user_id);
            
            if (!message || message.length === 0) {
                return socket.emit("error", {type: "delete_message", message: "Message not found"});
            }

            
            socket.to(room_id).emit("message_deleted", message_id);
            
        } catch (error) {
            return socket.emit("error", {type: "delete_message", message: "Server error"});
        }
    });


    socket.on("clear_room", async (room_id) => {
        try {
            
            let row = await clear_room_service(room_id, user_id);
            
            if (!row) {
                return socket.emit("error", { type: "clear_room", message: "Not allowed in this room" });
            }
            
            socket.to(room_id).emit("room_cleared", row);
            
        } catch (error) {
            return socket.emit("error", {type: "clear_room", message: "Server error"});
        }
    });



    socket.on("leave_room", async (room_id) => {
        if (!room_id || typeof room_id !== "string") return;

        try {
            let result = await leave_room_service(user_id, room_id);
            socket.leave(room_id);
            socket.emit("room_left", result);
        } catch (error) {
            return socket.emit("error", { type: "leave_room", message: "Server error" });
        }
    });
}

