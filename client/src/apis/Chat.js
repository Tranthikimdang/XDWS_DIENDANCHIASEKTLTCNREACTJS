// Socket.io server setup
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Chat model
const Chat = require('../models/chat');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (data) => {
    socket.join(data.room);
  });

  socket.on('send_message', async (data) => {
    const message = new Chat({
      room: data.room,
      sender: data.sender,
      recipient: data.recipient,
      message: data.message,
      timestamp: new Date()
    });
    await message.save();
    
    io.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(5000, () => console.log('Server running on port 5000'));