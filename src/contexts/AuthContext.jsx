import { createContext, useEffect, useState } from "react";
import { Backend } from "../api";

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

  useEffect(() => {
    Backend.get("/auth/check/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("UserData");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      }
    });
  }, []);

  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        loading,
        refreshToken,
        accessToken,
        userLocalData,
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
