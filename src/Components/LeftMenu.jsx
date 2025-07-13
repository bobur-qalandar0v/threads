import React, { useContext, useEffect, useState } from "react";
import LogoIcon from "../assets/icons/LogoIcon";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "../assets/icons/HomeIcon";
import SearchIcon from "../assets/icons/SearchIcon";
import PlusIcon from "../assets/icons/PlusIcon";
import HeartIcon from "../assets/icons/HeartIcon";
import ProfileIcon from "../assets/icons/ProfileIcon";
import AttachIcon from "../assets/icons/AttachIcon";
import MoreIcon from "../assets/icons/MoreIcon";
import HomeActiveIcon from "../assets/icons/HomeActiveIcon";
import SearchActiveIcon from "../assets/icons/SearchActiveIcon";
import HeartActiveIcon from "../assets/icons/HeartActiveIcon";
import ProfileActiveIcon from "../assets/icons/ProfileActiveIcon";
import { ModalContext } from "../contexts/ModalContext";
import { AuthContext } from "../contexts/AuthContext";

function LeftMenu() {
  const Location = useLocation();

  const { showLoading, setOpenMenu, openMenu, setOpenWarning, openWarning } =
    useContext(ModalContext);
  const { userLocalData, userProfile, accessToken, refreshToken } =
    useContext(AuthContext);

  const [activeButton, setActiveButton] = useState(null);

  const handleOpenMenu = () => {
    if (openMenu) {
      setOpenMenu(false);
    } else {
      setOpenMenu(true);
    }
  };

  const handleOpenWarning = () => {
    if (accessToken === "" && refreshToken === "") {
      setOpenWarning(true);
    } else {
      showLoading();
    }
  };

  const handleButtonClick = (item) => {
    setActiveButton(item);
  };

  useEffect(() => {
    switch (Location?.pathname) {
      case "/":
        setActiveButton(1);
        break;
      case "/search":
        setActiveButton(2);
        break;
      case "/activity":
        setActiveButton(3);
        break;
      default:
        if (Location?.pathname.startsWith(`/@${userLocalData?.username}`)) {
          setActiveButton(4);
        } else {
          setActiveButton(null);
        }
    }
  }, [userProfile, userLocalData?.username, Location.pathname]);

  return (
    <div className="menu__wrap">
      <div className="menu__items">
        <div className="menu__top">
          <Link to="/" onClick={() => setActiveButton(1)}>
            <LogoIcon />
          </Link>
        </div>
        <div className="menu__center">
          <div className="home hover">
            <Link
              to="/"
              className="center__btns"
              onClick={() => setActiveButton(1)}
            >
              {activeButton === 1 ? <HomeActiveIcon /> : <HomeIcon />}
            </Link>
          </div>
          <div className="search hover">
            <Link
              to="/search"
              className="center__btns"
              onClick={() => setActiveButton(2)}
            >
              {activeButton === 2 ? <SearchActiveIcon /> : <SearchIcon />}
            </Link>
          </div>
          <div className="plus__btn-wrap">
            <button
              className="center__btns plus__btn"
              onClick={handleOpenWarning}
            >
              <PlusIcon className="plus__icon" />
            </button>
          </div>
          <div className="heart hover">
            {accessToken === "" && refreshToken === "" ? (
              <button
                className="center__btns"
                onClick={() => setOpenWarning(true)}
              >
                {activeButton === 3 ? <HeartActiveIcon /> : <HeartIcon />}
              </button>
            ) : (
              <Link
                className="center__btns"
                to="/activity"
                onClick={() => handleButtonClick(3)}
              >
                {activeButton === 3 ? <HeartActiveIcon /> : <HeartIcon />}
              </Link>
            )}
          </div>
          <div className="profile hover">
            {accessToken === "" && refreshToken === "" ? (
              <button
                className="center__btns"
                onClick={() => setOpenWarning(true)}
              >
                {activeButton === 4 ? <ProfileActiveIcon /> : <ProfileIcon />}
              </button>
            ) : (
              <Link
                className="center__btns"
                to={`/@${userLocalData?.username}`}
                onClick={() => handleButtonClick(4)}
              >
                {activeButton === 4 ? <ProfileActiveIcon /> : <ProfileIcon />}
              </Link>
            )}
          </div>
        </div>
        <div className="menu__bottom">
          <div
            style={{
              width: "100%",
              height: "50%",
            }}
          >
            <button
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <AttachIcon className="attach__icon" />
            </button>
          </div>
          <div
            style={{
              width: "100%",
              height: "50%",
            }}
          >
            <button
              className="open__menu"
              style={{
                width: "100%",
                height: "100%",
              }}
              onClick={() => handleOpenMenu()}
            >
              <MoreIcon className={`more__icon ${openMenu ? "active" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftMenu;
