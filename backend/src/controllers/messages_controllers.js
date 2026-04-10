import { async_handler } from "../middlewares/async_handler.js";
import { 
    delete_message_service, 
    clear_room_service,
    get_messages_service,
    add_message_service
} from "../services/messages_service.js";

export const get_messages = async_handler(async (req, res) => {
    const room_id = req.params.room_id;
    const user_id = req.user_id;
    
    const messages = await get_messages_service(room_id, user_id);
    
    res.status(200).json({
        success: true,
        data: messages
    });
});



export const add_message = async_handler(async (req, res) => {
    const room_id = req.params.room_id;
    const sender_id = req.user_id;
    const { content } = req.body;
    
    const message = await add_message_service(room_id, sender_id, content);
    if (!message) {
        const err = new Error('Failed to create message');
        err.code = 500;
        throw err;
    }
    res.status(201).json({
        success: true,
        data: message[0]
    });
});


export const delete_message = async_handler(async (req, res) => {
    const message_id = req.params.message_id;
    const user_id = req.user_id;
    await delete_message_service(message_id, user_id);
    
    res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
    });
});


export const clear_room = async_handler(async (req, res) => {
    const room_id = req.params.room_id;
    const user_id = req.user_id;
    
    await clear_room_service(room_id, user_id);
  
    res.status(200).json({
        success: true,
        message: 'Room cleared successfully'
    });
});