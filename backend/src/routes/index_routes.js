import express from 'express';
import auth_routes from './auth_routes.js';
import messages_routes from './messages_routes.js';
import room_routes from './room_routes.js';
import user_routes from './user_routes.js';
import { verify_token } from '../middlewares/auth_middleware.js';

const router = express.Router();

router.use('/auth', auth_routes);
router.use('/messages', verify_token, messages_routes);
router.use('/rooms', verify_token, room_routes);
router.use('/users', verify_token, user_routes);

export default router;