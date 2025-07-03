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

// 401 BO‘LSA REFRESH TOKEN ORQALI YANGILASH
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

        const newAccessToken = res.data?.access;
        localStorage.setItem("access_token", newAccessToken);

        // Yangilangan token bilan headerni qo‘shish
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // So‘rovni qayta yuborish
        return Backend(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // refresh ham yaroqsiz bo‘lsa
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
