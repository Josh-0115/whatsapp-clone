import axios from "axios";

const API = axios.create({
  baseURL: "https://whatsapp-clone-n6sr.onrender.com/api", 
});

export default API;
