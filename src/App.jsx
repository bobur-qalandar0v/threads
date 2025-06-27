import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { routes } from "./constants/routes";
import LeftMenu from "./Components/LeftMenu";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ModalComponent from "./Modal";
import { AuthContext } from "./contexts/AuthContext";
import ProfilePage from "./pages/Profile/ProfilePage";
import ProfilePosts from "./pages/Profile/Components/ProfilePosts";
import ProfileReposts from "./pages/Profile/Components/ProfileReposts";
import ProfileMedia from "./pages/Profile/Components/ProfileMedia";
import ProfileReplies from "./pages/Profile/Components/ProfileReples";
import EditProfileModal from "./EditProfileModal";
import { ModalContext } from "./contexts/ModalContext";
import { Backend } from "./api";
import { backendurls } from "./constants/urls";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const { refreshToken, accessToken, setAccessToken } = useContext(AuthContext);

  const { openMenu, setOpenMenu, mainRef, openMenuRef } =
    useContext(ModalContext);

  const navigate = useNavigate();
  const Location = useLocation();

  const isAuthPage =
    Location.pathname === "/login" || Location.pathname === "/register";

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleLogout = async () => {
    const formData = new FormData();
    formData.append("refresh", refreshToken); // Refresh tokenni form-data sifatida qo'shish

    try {
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
    }

    navigate("/login");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("UserData");
    setAccessToken("");
    setOpenMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openMenuRef.current &&
        !openMenuRef.current.contains(e.target) &&
        !e.target.closest(".open__menu")
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu, openMenuRef]);

  return isAuthPage ? (
    Location.pathname === "/register" ? (
      <SignUp />
    ) : (
      <SignIn />
    )
  ) : (
    <div className="root__wrapper">
      <section className="left__menu">
        <LeftMenu />
      </section>

      {openMenu === true ? (
        <div className="openMenu__wrap" ref={openMenuRef}>
          <div className="openMenu__item">
            <button className="btns">Внешний вид</button>
            <button className="btns">Статистика</button>
            <button className="btns">Настройки</button>
            <p className="line"></p>
            <button className="btns" style={{ marginTop: "9px" }}>
              Сообщить о проблеме
            </button>
            <button className="logout" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      ) : null}

      <main className="main" ref={mainRef}>
        <Routes>
          {routes.map((item) => (
            <Route key={item.id} path={item.path} element={item.element} />
          ))}

          {/* ProfilePage */}
          <Route path="/:username" element={<ProfilePage />}>
            <Route index element={<ProfilePosts />} /> {/* VETKA */}
            <Route path="reposts" element={<ProfileReposts />} />
            <Route path="replies" element={<ProfileReplies />} />
            <Route path="media" element={<ProfileMedia />} />
          </Route>
        </Routes>
      </main>

      {accessToken ? (
        <></>
      ) : (
        <div className="login__btn">
          <Link to="/login" className="login__btn-wrap">
            Войти
          </Link>
        </div>
      )}
      <ModalComponent />
      <EditProfileModal />
    </div>
  );
}

export default App;
