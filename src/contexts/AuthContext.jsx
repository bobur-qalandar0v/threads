import { createContext, useEffect, useState } from "react";
import { Backend } from "../api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const localRefreshToken = localStorage.getItem("refresh_token")
    ? localStorage.getItem("refresh_token")
    : "";

  const localAccessToken = localStorage.getItem("access_token")
    ? localStorage.getItem("access_token")
    : "";

  const localUserData = localStorage.getItem("UserData")
    ? JSON.parse(localStorage.getItem("UserData"))
    : {};

  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(localRefreshToken);
  const [accessToken, setAccessToken] = useState(localAccessToken);
  const [isAuth, setIsAuth] = useState(false);
  const [myProfile, setMyProfile] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [userLocalData, setUserLocalData] = useState(localUserData);
  const [muted, setMuted] = useState(true);

  const setUserToken = (refresh_token, access_token) => {
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("access_token", access_token);
    setRefreshToken(refresh_token);
    setAccessToken(refresh_token);
  };

  const setLocalUserInfo = (data) => {
    localStorage.setItem("UserData", JSON.stringify(data));
    setUserLocalData(data);
  };

  const getMyProfile = async () => {
    if (accessToken && refreshToken) {
      try {
        setLoading(true);
        const res = await Backend.get(`/${userLocalData?.username}`);
        setMyProfile(res.data);
        setMyPosts(res.data.posts);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    }
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
        originalRequest._retry = true;

        try {
          const res = await Backend.post("/auth/token/refresh/", {
            refresh: localStorage.getItem("refresh_token"),
          });
          console.log(res);

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

  useEffect(() => {
    getMyProfile();
  }, [userLocalData]);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        loading,
        refreshToken,
        accessToken,
        userLocalData,
        userProfile,
        myProfile,
        userPosts,
        myPosts,
        setIsAuth,
        setMyPosts,
        setUserToken,
        setMyProfile,
        setUserPosts,
        setAccessToken,
        setUserLocalData,
        setLocalUserInfo,
        setUserProfile,
        getMyProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
