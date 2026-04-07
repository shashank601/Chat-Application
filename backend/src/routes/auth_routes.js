import express from 'express';
import { register, login, verify } from '../controllers/auth_controllers.js';
import verify_token from '../middlewares/verify_token.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verify_token, verify);


export default router;