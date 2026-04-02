import express from 'express';
import { 
    search_users, 
    add_member_to_group, 
    leave_group, 
    promote_to_admin 
} from '../controllers/user_controllers.js';

const router = express.Router();

router.get('/search', search_users);
router.post('/:room_id/:member_id', add_member_to_group);
router.post('/:room_id/leave', leave_group);
router.post('/:room_id/promote/:member_id', promote_to_admin);

export default router;