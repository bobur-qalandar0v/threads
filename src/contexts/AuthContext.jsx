import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const local = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : "";

  const localUser = localStorage.getItem("UserId")
    ? JSON.parse(localStorage.getItem("UserId"))
    : null;

  const [token, setToken] = useState(local);
  const [isAuth, setIsAuth] = useState(false);
  const [userId, setUserId] = useState(localUser);

  const setUserToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const setUserData = (data) => {
    localStorage.setItem("UserID", JSON.stringify(data));
    setUserId(data);
  };

  useEffect(() => {
    setIsAuth(!!local && local.length > 0);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ isAuth, setIsAuth, setUserToken, setUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
