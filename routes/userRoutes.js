import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllUsers); 

export default router;
