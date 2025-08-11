import axios from "axios";

const API = axios.create({
  baseURL: "https://whatsapp-clone-n6sr.onrender.com/api", // ✅ Render backend API URL
});

export default API;

