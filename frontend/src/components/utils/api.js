import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  withCredentials: true,
});

console.log("🔗 API Base URL:", import.meta.env.VITE_API_URI);
