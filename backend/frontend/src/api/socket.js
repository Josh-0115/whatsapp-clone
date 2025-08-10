import { io } from "socket.io-client";

const SOCKET_URL = "https://whatsapp-clone-n6sr.onrender.com/api";

const socket = io(SOCKET_URL, {
  autoConnect: false, // connect manually
  reconnectionAttempts: 5
});

export default socket;