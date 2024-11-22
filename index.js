const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Allow requests from your frontend
      methods: ['GET', 'POST'],
    },
});


app.use(cors({
    origin: 'http://localhost:5173',
  }));

// Serve static files if needed
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for text changes
  socket.on('text-change', (data) => {
    // Broadcast the changes to all other clients
    socket.broadcast.emit('receive-text-change', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
