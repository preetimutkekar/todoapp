// frontend/src/socket.js
import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000', {
  transports: ['websocket'], // ✅ helps force direct WebSocket connection
});
