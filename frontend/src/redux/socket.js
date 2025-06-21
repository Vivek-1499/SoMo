// socket.js
import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (userId) => {
  socket = io('http://localhost:8000', {
    query: { userId },
    transports: ['websocket'],
  });

  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) socket.close();
  socket = null;
};
