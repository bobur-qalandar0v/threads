import React, { useContext } from "react";
import InsightsIcon from "../../assets/icons/InsigthsIcon";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ModalContext } from "../../contexts/ModalContext";

function ProfilePage() {
  const { userInfo, loading } = useContext(AuthContext);
  const { showEditModal } = useContext(ModalContext);

  return (
    <div className="profile">
      <div className="profile__header">
        <h3 className="title">Профиль</h3>
      </div>
      <div className="profile__main">
        {loading ? (
          <div className="loader__wrap">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="profile__top">
              <div className="profile__username-photo">
                <div className="left">
                  <h2>{userInfo?.name_and_surname}</h2>
                  <p>{userInfo?.username}</p>
                </div>
                <div className="right">
                  <button>
                    <img
                      width={90}
                      height={90}
                      style={{ borderRadius: "50%" }}
                      src={
                        userInfo?.profile_img === "" ||
                        userInfo?.profile_img === undefined
                          ? userInfo?.profile_default_img
                          : userInfo?.profile_img
                      }
                      alt="img"
                    />
                  </button>
                </div>
              </div>
              <div className="profile__follow-insights">
                {userInfo?.user_bio === "" ? null : (
                  <div className="profile__bio">
                    <p style={{ color: "#fff" }}>{userInfo?.user_bio}</p>
                  </div>
                )}
                <div className="follows">
                  <div>
                    <div className="img__wrap">
                      <div>
                        <img
                          className="img"
                          width={24}
                          height={24}
                          style={{ borderRadius: "50%" }}
                          src="/dost.jpg"
                          alt="img"
                        />
                        <img
                          className="img"
                          width={24}
                          height={24}
                          style={{ borderRadius: "50%" }}
                          src="/ovqat.jpeg"
                          alt="img"
                        />
                        <img
                          className="img"
                          width={24}
                          height={24}
                          style={{ borderRadius: "50%" }}
                          src="/ovqat2.jpeg"
                          alt="img"
                        />
                      </div>
                      <span>59 подписчиков</span>
                    </div>
                    {userInfo?.user_url === "" ? null : (
                      <div className="user__url-wrap">
                        <Link
                          to={userInfo?.user_url}
                          className="user_url"
                          target="_blank"
                        >
                          {userInfo?.user_url?.slice(
                            8,
                            userInfo?.user_url?.length
                          )}
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="insights">
                    <button className="insights__btn">
                      <InsightsIcon />
                    </button>
                  </div>
                </div>
              </div>
              <div className="change__btn-wrap">
                <button className="change__btn" onClick={showEditModal}>
                  Редактировать профиль
                </button>
              </div>
            </div>
            <div className="profile__center">
              <div className="center__wrap">
                <div className="tabs">
                  <NavLink
                    to={`/${userInfo?.username}`}
                    end
                    className={`links ${(isActive) =>
                      isActive ? "active" : ""}`}
                  >
                    Ветки
                  </NavLink>
                  <NavLink
                    className={`links ${(isActive) =>
                      isActive ? "active" : ""}`}
                    to={`/${userInfo?.username}/replies`}
                    end
                  >
                    Ответы
                  </NavLink>
                  <NavLink
                    to={`/${userInfo?.username}/media`}
                    end
                    className={`links ${(isActive) =>
                      isActive ? "active" : ""}`}
                  >
                    Медиафайлы
                  </NavLink>
                  <NavLink
                    to={`/${userInfo?.username}/reposts`}
                    end
                    className={`links ${(isActive) =>
                      isActive ? "active" : ""}`}
                  >
                    Репосты
                  </NavLink>
                </div>
                <Outlet />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
