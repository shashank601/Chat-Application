import express from 'express';
import { 
    create_room,
    delete_room,
    get_my_rooms, 
    get_room_members 
} from '../controllers/room_controllers.js';

const router = express.Router();

router.post('/', create_room);
router.delete('/:room_id', delete_room);
router.get('/chats', get_my_rooms);
router.get('/:room_id/members', get_room_members);

export default router;