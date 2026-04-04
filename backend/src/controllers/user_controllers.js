import { async_handler } from "../middlewares/async_handler.js";
import { 
    leave_room_service, 
    add_member_to_group_service,
    search_users_service,
    promote_to_admin_service
} from "../services/user_service.js";


export const search_users = async_handler(async (req, res) => {
    const { q } = req.query;
    const user_id = req.user_id;

  
    const result = await search_users_service(q, user_id);
    res.status(200).json({
        success: true,
        data: result
    });
    
});





export const add_member_to_group = async_handler(async (req, res) => {
    const user_id = req.user_id;
    const { room_id, member_id } = req.params;
    let result = await add_member_to_group_service(room_id, member_id, user_id);

    res.status(201).json({
        success: true,
        data: result
    });
    
});



export const leave_group = async_handler(async (req, res) => {
    const user_id = req.user_id;
    const { room_id } = req.params;
    const result_rows = await leave_room_service(user_id, room_id);

    res.status(200).json({
        success: true,
        data: result_rows
    });
});


export const promote_to_admin = async_handler(async (req, res) => {
    const user_id = req.user_id;
    const { room_id, member_id } = req.params;

    

    

    const result_rows = await promote_to_admin_service(user_id, room_id, member_id);
    
    res.status(200).json({
        success: true,
        data: result_rows
    });
    
});