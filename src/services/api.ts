import axios from "axios";

const api = axios.create({
  baseURL: "https://us-central1-tarefou-10ff1.cloudfunctions.net",
});

export default api;
