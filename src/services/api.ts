import axios from "axios";

const api = axios.create({
  baseURL: "https://tarefou-push-service.vercel.app",
});

export default api;
