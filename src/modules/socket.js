// src/socket.js
import { io } from 'socket.io-client';

// Koneksi ke server Socket.IO
const socket = io('http://localhost:3000', {
    transports: ['websocket']
}); // Sesuaikan dengan URL server Anda
export default socket;
