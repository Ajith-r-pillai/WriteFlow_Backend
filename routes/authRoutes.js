import express from 'express';
import { login, register, searchUsers ,checkAuth} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/check', protect,checkAuth);

router.get('/search', protect, searchUsers);
export default router;
