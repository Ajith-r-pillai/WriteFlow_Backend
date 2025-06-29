import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { setupSocket } from './sockets/sockets.js';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);



const io = new Server(server, {
  cors: {
    origin: '*', // or use your frontend URL: ['http://localhost:5173']
    methods: ['GET', 'POST'],
  },
});

setupSocket(io);



connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
