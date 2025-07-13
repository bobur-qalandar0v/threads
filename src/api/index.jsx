import axios from "axios";

export const Backend = axios.create({
  baseURL: "https://threadsapi-vd30.onrender.com",
});

Backend.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
