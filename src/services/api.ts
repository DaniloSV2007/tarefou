import axios from "axios";
import { PUSH_NOTIFICATIONS_API } from "@env";

const api = axios.create({
  baseURL: "https://us-central1-tarefou-10ff1.cloudfunctions.net",
});

export default api;
