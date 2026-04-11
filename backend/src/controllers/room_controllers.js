import { async_handler } from "../middlewares/async_handler.js";
import { pool } from "../config/db.js";
import { 
    create_room_service, 
    get_my_rooms_service, 
    get_room_members_service,
    delete_room_service 
} from "../services/room_services.js";



export const create_room = async_handler(async (req, res) => {
    
    const { receiver_id, group_name } = req.body; 
    const user_id = req.user_id;
    
    const room = await create_room_service(receiver_id, group_name, user_id);


    
    const userRoom = String(user_id);
    req.io.to(userRoom).emit('room:created', room);

    if (room.type === 'direct' && receiver_id) {
        const receiverRoom = String(receiver_id);
        req.io.to(receiverRoom).emit('room:created', room);
    }
    
    res.status(201).json({
        success: true,
        data: room
    });
});




export const delete_room = async_handler(async (req, res) => {
    const room_id = req.params.room_id;
    const user_id = req.user_id;

    await delete_room_service(room_id, user_id);
    
    res.status(200).json({
        success: true,
        message: 'Room deleted successfully'
    });
});





export const get_my_rooms = async_handler(async (req, res) => {
    const user_id = req.user_id;
    
    const rooms = await get_my_rooms_service(user_id);
    res.status(200).json({
        success: true,
        data: rooms
    });
});






export const get_room_members = async_handler(async (req, res) => {
    const room_id = req.params.room_id;
    const user_id = req.user_id;
  
    const members = await get_room_members_service(room_id, user_id);
    res.status(200).json({
        success: true,
        data: members
    });
});
