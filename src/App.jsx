import React, { useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { routes } from "./constants/routes";
import LeftMenu from "./Components/LeftMenu";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ModalComponent from "./Modal";

function App() {
  const [darkMode, setDarkMode] = useState(false);

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
          <Route />
        </Routes>
      </main>
      <div className="login__btn">
        <Link to="/login" className="login__btn-wrap">
          Войти
        </Link>
      </div>
      <ModalComponent />
    </div>
  );
}

export default App;
