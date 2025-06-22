import axios from "axios";

const api = axios.create({
  baseURL:
    "https://c545-2804-2488-a083-9ad0-5936-ce34-ea17-b30e.ngrok-free.app",
});

export default api;
