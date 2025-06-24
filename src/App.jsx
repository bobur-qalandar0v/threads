import React, { useContext, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
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

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const { token } = useContext(AuthContext);

  const Location = useLocation();

  const isAuthPage =
    Location.pathname === "/login" || Location.pathname === "/register";

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

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

      <main className="main">
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

      {token ? (
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
