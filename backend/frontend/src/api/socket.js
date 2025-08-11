import { io } from "socket.io-client";

const SOCKET_URL = "https://whatsapp-clone-n6sr.onrender.com"; // Render backend URL

export const socket = io(SOCKET_URL);
