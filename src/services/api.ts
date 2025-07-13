import axios from "axios";

const api = axios.create({
  baseURL: "https://fdb30be03bfc.ngrok-free.app",
});

export default api;
