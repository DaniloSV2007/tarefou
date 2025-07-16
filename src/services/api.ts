import axios from "axios";
import { PUSH_NOTIFICATIONS_API } from "@env";

const api = axios.create({
  baseURL: PUSH_NOTIFICATIONS_API,
});

export default api;
