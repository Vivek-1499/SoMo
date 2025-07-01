import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      store.dispatch(setAuthUser(null));
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);