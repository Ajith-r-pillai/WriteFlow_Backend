import mongoose from 'mongoose';
import Note from '../models/Note.js';
import User from '../models/User.js';



export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      $or: [{ owner: req.user._id }, { collaborators: req.user._id }],
    })
      .sort('-updatedAt')
      .populate('owner', 'name email')               // populate owner's name & email
      .populate('collaborators', 'name email');      // populate collaborators' name & email

    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

export const getNoteById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  const note = await Note.findById(id)
    .populate('owner', 'id name email')
    .populate('collaborators', 'id name email');

  if (!note) return res.status(404).json({ message: 'Note not found' });

  const isOwner = note.owner._id.equals(req.user._id);
  const isCollaborator = note.collaborators.some(c => c._id.equals(req.user._id));

  if (!isOwner && !isCollaborator) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json(note);
};

export const createNote = async (req, res) => {
  try {
    console.log(req.body,req.user);
    
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      owner: req.user._id,
    });

    await note.save(); // 👈 using .save()

    res.status(201).json(note);
  } catch (err) {
    console.error('Create Note Error:', err.message);
    res.status(500).json({ message: 'Failed to create note' });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ message: 'Note not found' });

  const isOwner = note.owner.equals(req.user._id);
  const isCollaborator = note.collaborators.includes(req.user._id);
  if (!isOwner && !isCollaborator) {
    return res.status(403).json({ message: 'Access denied' });
  }
  

  note.title = req.body.title;
  note.content = req.body.content;
  await note.save();
  res.json(note);
};

export const deleteNotes = async (req, res) => {
  const { noteIds } = req.body;
  const userId = req.user._id;

  if (!Array.isArray(noteIds) || noteIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
    return res.status(400).json({ message: 'Invalid note IDs' });
  }

  // Find notes owned by the user
  const notesToDelete = await Note.find({ _id: { $in: noteIds }, owner: userId });

  if (notesToDelete.length === 0) {
    return res.status(403).json({ message: 'No notes to delete or not authorized' });
  }

  const deleted = await Note.deleteMany({ _id: { $in: notesToDelete.map(n => n._id) } });
  res.json({ deletedCount: deleted.deletedCount });
};

export const addCollaborator = async (req, res) => {
  const { id } = req.params;      // note ID
  const { userId } = req.body;    // user to add

  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (!note.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the owner can add collaborators' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadyExists = note.collaborators.some((collabId) =>
      collabId.equals(user._id)
    );

    if (!alreadyExists) {
      note.collaborators.push(user._id);
      await note.save();
    }

    // Return updated collaborators
    const populatedNote = await Note.findById(id).populate('collaborators', 'id name email');
    res.status(200).json(populatedNote.collaborators);
  } catch (err) {
    console.error('Add Collaborator Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getCollaborators = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id).populate('collaborators', 'id name email');
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const isOwner = note.owner.equals(req.user._id);
    const isCollaborator = note.collaborators.some((u) => u._id.equals(req.user._id));

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(note.collaborators);
  } catch (err) {
    console.error('Get Collaborators Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// controllers/noteController.js
export const leaveNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: 'Note not found' });

  note.collaborators = note.collaborators.filter(
    (id) => id.toString() !== req.user._id.toString()
  );
  await note.save();
  res.json({ message: 'Left the note' });
};

export const removeCollaborator = async (req, res) => {
  const { id, userId } = req.params;
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ message: 'Note not found' });

  if (!note.owner.equals(req.user._id)) {
    return res.status(403).json({ message: 'Only owner can remove collaborators' });
  }

  note.collaborators = note.collaborators.filter(
    (collabId) => collabId.toString() !== userId
  );
  await note.save();
  const populated = await note.populate('collaborators', 'name email');
  res.json(populated.collaborators);
};
