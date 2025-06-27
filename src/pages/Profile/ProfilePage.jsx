import React, { useContext, useEffect } from "react";
import InsightsIcon from "../../assets/icons/InsigthsIcon";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ModalContext } from "../../contexts/ModalContext";
import { Backend } from "../../api";

function ProfilePage() {
  const { userInfo, loading, userLocalData } = useContext(AuthContext);
  const { showEditModal } = useContext(ModalContext);

  const getBackend = async () => {
    try {
      const res = await Backend.get(`/${userLocalData?.username}`);
      // console.log(res);
    } catch (err) {
      console.error("Xatolik:", err);
    }
  };

  useEffect(() => {
    getBackend();
  }, []);

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
                  <h2>{userLocalData?.fullname}</h2>
                  <p>{userLocalData?.username}</p>
                </div>
                <div className="right">
                  <button>
                    <img
                      width={90}
                      height={90}
                      style={{ borderRadius: "50%" }}
                      src={
                        userLocalData?.photo === null
                          ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
                          : userLocalData?.photo
                      }
                      alt="img"
                    />
                  </button>
                </div>
              </div>
              <div className="profile__follow-insights">
                {userLocalData?.bio === null ? null : (
                  <div className="profile__bio">
                    <p style={{ color: "#fff" }}>{userLocalData?.bio}</p>
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
                    {userLocalData?.link === null ? null : (
                      <div className="user__url-wrap">
                        <Link
                          to={userLocalData?.link}
                          className="user_url"
                          target="_blank"
                        >
                          {userLocalData?.link?.slice(
                            8,
                            userLocalData?.link?.length
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
                    to={`/${userLocalData?.username}`}
                    end
                    className={`links ${(isActive) =>
                      isActive ? "active" : ""}`}
                  >
                    Ветки
                  </NavLink>
                  <NavLink
                    className={`links ${(isActive) =>
                      isActive ? "active" : ""}`}
                    to={`/${userLocalData?.username}/replies`}
                    end
                  >
                    Ответы
                  </NavLink>
                  <NavLink
                    to={`/${userLocalData?.username}/media`}
                    end
                    className={`links ${(isActive) =>
                      isActive ? "active" : ""}`}
                  >
                    Медиафайлы
                  </NavLink>
                  <NavLink
                    to={`/${userLocalData?.username}/reposts`}
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
