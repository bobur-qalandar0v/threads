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

function LeftMenu() {
  const [activeButton, setActiveButton] = useState(null);

  const { showLoading } = useContext(ModalContext);

  const Location = useLocation();

  const handleButtonClick = (item) => {
    setActiveButton(item);
  };

  useEffect(() => {
    switch (Location.pathname) {
      case "/":
        setActiveButton(1);
        break;
      case "/search":
        setActiveButton(2);
        break;
      case "/activity":
        setActiveButton(3);
        break;
      case "/profile":
        setActiveButton(4);
        break;
    }
  }, [Location.pathname]);

  return (
    <div className="menu__wrap">
      <div className="menu__items">
        <div className="menu__top">
          <Link to="/" onClick={() => handleButtonClick(1)}>
            <LogoIcon />
          </Link>
        </div>
        <div className="menu__center">
          <div className="home hover">
            <Link
              to="/"
              className="center__btns"
              onClick={() => handleButtonClick(1)}
            >
              {activeButton === 1 ? <HomeActiveIcon /> : <HomeIcon />}
            </Link>
          </div>
          <div className="search hover">
            <Link
              to="/search"
              className="center__btns"
              onClick={() => handleButtonClick(2)}
            >
              {activeButton === 2 ? <SearchActiveIcon /> : <SearchIcon />}
            </Link>
          </div>
          <div className="plus__btn-wrap">
            <button className="center__btns plus__btn" onClick={showLoading}>
              <PlusIcon className="plus__icon" />
            </button>
          </div>
          <div className="heart hover">
            <Link to="activity" onClick={() => handleButtonClick(3)}>
              {activeButton === 3 ? <HeartActiveIcon /> : <HeartIcon />}
            </Link>
          </div>
          <div className="profile hover">
            <Link to="/profile" onClick={() => handleButtonClick(4)}>
              {activeButton === 4 ? <ProfileActiveIcon /> : <ProfileIcon />}
            </Link>
          </div>
        </div>
        <div className="menu__bottom">
          <div>
            <button>
              <AttachIcon className="attach__icon" />
            </button>
          </div>
          <div>
            <button>
              <MoreIcon className="more__icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftMenu;
