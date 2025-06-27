import axios from "axios";

export const API = axios.create({
  baseURL: "https://5cde39e7ec452d62.mokky.dev",
});

export const Backend = axios.create({
  baseURL: "https://threadsapi-vd30.onrender.com",
});

Backend.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await Backend.post("/auth/token/refresh/", {
          refresh: localStorage.getItem("refresh_token"),
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("access_token", newAccessToken);

        // Avvalgi so‘rovni yangilangan token bilan qayta yuborish
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return Backend(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // agar refresh ham yaroqsiz bo‘lsa
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
