import { createContext, useEffect, useState } from "react";
import { API } from "../api";
import { urls } from "../constants/urls";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const localRefreshToken = localStorage.getItem("refresh_token")
    ? localStorage.getItem("refresh_token")
    : "";

  const localAccessToken = localStorage.getItem("access_token")
    ? localStorage.getItem("access_token")
    : "";

  const localUser = localStorage.getItem("UserId")
    ? JSON.parse(localStorage.getItem("UserId"))
    : null;

  const localUserData = localStorage.getItem("UserData")
    ? JSON.parse(localStorage.getItem("UserData"))
    : {};

  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(localRefreshToken);
  const [accessToken, setAccessToken] = useState(localAccessToken);
  const [isAuth, setIsAuth] = useState(false);
  const [userId, setUserId] = useState(localUser);
  const [userInfo, setUserInfo] = useState([]);
  const [userLocalData, setUserLocalData] = useState(localUserData);

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

  const setUserData = (data) => {
    localStorage.setItem("UserId", JSON.stringify(data));
    setUserId(data);
  };

  const getUserData = async () => {
    try {
      setLoading(true);
      API.get(`${urls.auth.user}/${userId}`).then((res) =>
        setUserInfo(res.data)
      );
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userId,
        isAuth,
        loading,
        refreshToken,
        accessToken,
        userInfo,
        userLocalData,
        setIsAuth,
        setUserToken,
        setUserData,
        getUserData,
        setUserInfo,
        setAccessToken,
        setUserLocalData,
        setLocalUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
