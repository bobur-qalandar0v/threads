import React, { useContext, useEffect } from "react";
import InsightsIcon from "../../assets/icons/InsigthsIcon";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ModalContext } from "../../contexts/ModalContext";
import PrevIcon from "../../assets/icons/PrevIcon";

function ProfilePage() {
  const navigate = useNavigate();

  const { loading, myProfile, userProfile, getProfile, setUsername } =
    useContext(AuthContext);

  const { showEditModal } = useContext(ModalContext);

  const handleNavigate = () => {
    localStorage.setItem("userProfile", JSON.stringify(myProfile?.username));
    setUsername(myProfile?.username);
    navigate(-1);
  };

  useEffect(() => {
    if (userProfile?.username) {
      getProfile({ author: { username: userProfile?.username } });
    }
  }, [location.pathname]);

  return (
    <div className="profile">
      {userProfile?.is_owner === true ? (
        <>
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
                      <h2>{myProfile?.fullname}</h2>
                      <p>{myProfile?.username}</p>
                    </div>
                    <div className="right">
                      <button>
                        <img
                          width={90}
                          height={90}
                          style={{ borderRadius: "50%" }}
                          src={
                            myProfile?.photo === null
                              ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
                              : myProfile?.photo
                          }
                          alt="img"
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="profile__follow-insights">
                    {myProfile?.bio === null ? null : (
                      <div className="profile__bio">
                        <p style={{ color: "#fff" }}>{myProfile?.bio}</p>
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
                        {myProfile?.link === null ? null : (
                          <div className="user__url-wrap">
                            <Link
                              to={myProfile?.link}
                              className="user_url"
                              target="_blank"
                            >
                              {myProfile?.link?.slice(
                                8,
                                myProfile?.link?.length
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
                        to={`/@${myProfile?.username}`}
                        end
                        className={`links ${(isActive) =>
                          isActive ? "active" : ""}`}
                      >
                        Ветки
                      </NavLink>
                      <NavLink
                        className={`links ${(isActive) =>
                          isActive ? "active" : ""}`}
                        to={`/@${myProfile?.username}/replies`}
                        end
                      >
                        Ответы
                      </NavLink>
                      <NavLink
                        to={`/@${myProfile?.username}/media`}
                        end
                        className={`links ${(isActive) =>
                          isActive ? "active" : ""}`}
                      >
                        Медиафайлы
                      </NavLink>
                      <NavLink
                        to={`/@${myProfile?.username}/reposts`}
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
        </>
      ) : (
        <>
          <div className="profile__header">
            <button className="prev__btn" onClick={() => handleNavigate()}>
              <PrevIcon />
            </button>
            <h3 className="title">{userProfile?.username}</h3>
            <p></p>
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
                      <h2>{userProfile?.fullname}</h2>
                      <p>{userProfile?.username}</p>
                    </div>
                    <div className="right">
                      <button>
                        <img
                          width={90}
                          height={90}
                          style={{ borderRadius: "50%" }}
                          src={
                            userProfile?.photo === null
                              ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
                              : userProfile?.photo
                          }
                          alt="img"
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="profile__follow-insights">
                    {userProfile?.bio === null ? null : (
                      <div className="profile__bio">
                        <p style={{ color: "#fff" }}>{userProfile?.bio}</p>
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
                        {userProfile?.link === null ? null : (
                          <div className="user__url-wrap">
                            <Link
                              to={userProfile?.link}
                              className="user_url"
                              target="_blank"
                            >
                              {userProfile?.link?.slice(
                                8,
                                userProfile?.link?.length
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
                  <div className="follow__btn-wrap">
                    <button className="follow-btn">Подписаться</button>
                    <button className="mention-btn">Упомянуть</button>
                  </div>
                </div>
                <div className="profile__center">
                  <div className="center__wrap">
                    <div className="tabs">
                      <NavLink
                        to={`/@${userProfile?.username}`}
                        end
                        className={`links ${(isActive) =>
                          isActive ? "active" : ""}`}
                      >
                        Ветки
                      </NavLink>
                      <NavLink
                        className={`links ${(isActive) =>
                          isActive ? "active" : ""}`}
                        to={`/@${userProfile?.username}/replies`}
                        end
                      >
                        Ответы
                      </NavLink>
                      <NavLink
                        to={`/@${userProfile?.username}/media`}
                        end
                        className={`links ${(isActive) =>
                          isActive ? "active" : ""}`}
                      >
                        Медиафайлы
                      </NavLink>
                      <NavLink
                        to={`/@${userProfile?.username}/reposts`}
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
        </>
      )}
    </div>
  );
}

export default ProfilePage;
