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

  let DarkMode = localStorage.getItem("dark-mode")
    ? JSON.parse(localStorage.getItem("dark-mode"))
    : true;

  const [darkMode, setDarkMode] = useState(DarkMode);
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(localRefreshToken);
  const [accessToken, setAccessToken] = useState(localAccessToken);
  const [isAuth, setIsAuth] = useState(false);
  const [myProfile, setMyProfile] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [userLocalData, setUserLocalData] = useState(localUserData);

  const setUserToken = (refresh_token, access_token) => {
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("access_token", access_token);
    setRefreshToken(refresh_token);
    setAccessToken(access_token);
  };

  const setLocalUserInfo = (data) => {
    localStorage.setItem("UserData", JSON.stringify(data));
    setUserLocalData(data);
  };

  const getMyProfile = async () => {
    if (
      accessToken !== "" &&
      refreshToken !== "" &&
      userLocalData?.username !== ""
    ) {
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
    }).catch((err) => {
      if (err.status == 401) {
        localStorage.removeItem("UserData");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // window.location.href = "/login";
      }
    });
  }, []);

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
        darkMode,
        setDarkMode,
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
