import React, { useContext, useState } from "react";
import { ModalContext } from "./contexts/ModalContext";
import { useNavigate } from "react-router-dom";
import { Backend } from "./api";
import { backendurls } from "./constants/urls";
import { AuthContext } from "./contexts/AuthContext";

function LogOutModal() {
  const navigate = useNavigate();

  const { logoutModal, setLogOutModal, setLogoutLoading, logoutLoading } =
    useContext(ModalContext);
  const { refreshToken, setAccessToken, accessToken } = useContext(AuthContext);

  const handleLogout = async () => {
    const formData = new FormData();
    formData.append("refresh", refreshToken); // Refresh tokenni form-data sifatida qo'shish

    try {
      setLogoutLoading(true);
      await Backend.post(
        backendurls.auth.logout,
        formData, // Form data sifatida yuborish
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Bearer token headerda
            "Content-Type": "multipart/form-data", // Form-data uchun header
          },
        }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLogoutLoading(false);
    }

    navigate("/login");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("UserData");
    setAccessToken("");
    setLogOutModal(false);
  };

  const handleCancel = () => {
    setLogOutModal(false);
  };

  if (!logoutModal) {
    return null;
  }

  return (
    <>
      <div className="logout">
        <div className="logout__wrap">
          <div className="logout__content">
            <h3>Выйти из Threads?</h3>
          </div>
          <div className="btns__wrap">
            <button className="cancel" onClick={() => handleCancel()}>
              <span>Отмена</span>
            </button>
            <button className="delete" onClick={() => handleLogout()}>
              {logoutLoading ? (
                <div className="loader"></div>
              ) : (
                <span>Выйти</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogOutModal;
