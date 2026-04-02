import express from 'express';
import auth_routes from './auth_routes.js';
import messages_routes from './messages_routes.js';
import room_routes from './room_routes.js';
import user_routes from './user_routes.js';

const router = express.Router();

router.use('/auth', auth_routes);
router.use('/messages', messages_routes);
router.use('/rooms', room_routes);
router.use('/users', user_routes);

export default router;