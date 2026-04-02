import express from 'express';
import { add_message, get_messages, clear_room, delete_message } from '../controllers/messages_controllers.js';

const router = express.Router();

router.post('/:room_id', add_message);
router.get('/:room_id', get_messages);
router.delete('/:room_id', clear_room);
router.delete('/:room_id/:message_id', delete_message);

export default router;