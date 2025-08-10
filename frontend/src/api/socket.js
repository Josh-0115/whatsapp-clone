import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // change to your backend URL in production

const socket = io(SOCKET_URL, {
  autoConnect: false, // connect manually
  reconnectionAttempts: 5
});

export default socket;