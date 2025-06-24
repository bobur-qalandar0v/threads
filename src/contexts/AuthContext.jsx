import { createContext, useEffect, useState } from "react";
import { API } from "../api";
import { urls } from "../constants/urls";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const local = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : "";

  const localUser = localStorage.getItem("UserId")
    ? JSON.parse(localStorage.getItem("UserId"))
    : null;

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(local);
  const [isAuth, setIsAuth] = useState(false);
  const [userId, setUserId] = useState(localUser);
  const [userInfo, setUserInfo] = useState([]);

  const setUserToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
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
    setIsAuth(!!local && local.length > 0);
  }, [token]);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        token,
        isAuth,
        setIsAuth,
        setUserToken,
        setUserData,
        userId,
        userInfo,
        getUserData,
        setUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
