import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change if backend is deployed
});

export default API;
