import axios from "axios";

export const Backend = axios.create({
  baseURL: "https://threadsapi-vd30.onrender.com",
});

// Backend.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

Backend.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      // Retry belgilaymiz
      originalRequest._retry = true;

      if (isRefreshing) {
        // Agar token yangilanayotgan bo‘lsa, queue ga qo‘shamiz
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return Backend(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const res = await Backend.post("/auth/token/refresh/", {
          refresh: localStorage.getItem("refresh_token"),
        });

        const newAccessToken = res.data?.access;
        localStorage.setItem("access_token", newAccessToken);
        Backend.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;

        processQueue(null, newAccessToken); // Queue dagilarga tokenni yubor
        return Backend(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("UserData");
        window.location.href = "/login"; // ❗ Tokenlar yaroqsiz bo‘lsa login sahifaga yo‘naltir
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
