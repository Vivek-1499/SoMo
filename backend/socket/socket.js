import {Server} from 'socket.io'
import express from 'express'
import http from 'http'

const app = express();

const server = http.createServer(app)

const io = new Server(server, {
  cors:{
    origin:'http://localhost:5173',
    methods:['GET', 'POST'],
    credentials: true,
  }
})

const userSocketMap = {};//we get to know how many users are online using it, it stores user socket id corresponding to userId
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    socket.disconnect();
    return;
  }

  userSocketMap[userId] = socket.id;

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { app, server, io };