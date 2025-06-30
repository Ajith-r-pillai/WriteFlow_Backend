export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(' User connected:', socket.id);

    // Join a note room
    socket.on('joinNote', (noteId) => {
      console.log(`Socket ${socket.id} joined note: ${noteId}`);
      socket.join(noteId);
    });

    // Leave a note room
    socket.on('leaveNote', (noteId) => {
      console.log(` Socket ${socket.id} left note: ${noteId}`);
      socket.leave(noteId);
    });

    // User is typing
    socket.on('typing', ({ noteId, user }) => {
      socket.to(noteId).emit('typing', user);
    });

    // User stopped typing
    socket.on('stopTyping', ({ noteId }) => {
      socket.to(noteId).emit('stopTyping');
    });

    // Note content was updated
    socket.on('noteUpdated', ({ noteId, data }) => {
      socket.to(noteId).emit('noteUpdated', data); // { title, content }
    });

    // Collaborators changed
    socket.on('collaboratorUpdated', ({ noteId }) => {
      socket.to(noteId).emit('collaboratorUpdated');
    });

    // On disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
