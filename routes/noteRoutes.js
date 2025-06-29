import express from 'express';
import {
  getNotes, createNote, updateNote, deleteNotes, addCollaborator,getNoteById,leaveNote,removeCollaborator
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/', protect,getNotes);
router.post('/', protect,createNote);
router.put('/:id',protect, updateNote);
router.post('/bulk-delete', protect, deleteNotes);
router.get('/:id', getNoteById); 
router.post('/:id/collaborators',protect, addCollaborator);
// routes/noteRoutes.js
router.post('/:id/leave', protect, leaveNote);
router.delete('/:id/collaborators/:userId', protect, removeCollaborator);

export default router;
