import { io } from "socket.io-client";

// ✅ Point Socket.IO to your Render backend
const SOCKET_URL = "https://whatsapp-clone-n6sr.onrender.com";
const socket = io(SOCKET_URL);

export default socket;