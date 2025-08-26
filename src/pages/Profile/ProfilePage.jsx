import React, { useContext, useEffect, useRef, useState } from "react";
import InsightsIcon from "../../assets/icons/InsigthsIcon";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ModalContext } from "../../contexts/ModalContext";
import PrevIcon from "../../assets/icons/PrevIcon";
import { Backend } from "../../api";

function ProfilePage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const profileMainRef = useRef(null);
  const videoRefs = useRef([]);
  const menuRef = useRef(null);

  const {
    myProfile,
    setUserPosts,
    userPosts,
    setUserProfile,
    userProfile,
    accessToken,
    refreshToken,
    myPosts,
  } = useContext(AuthContext);

  const {
    showEditModal,
    setFollowModal,
    follow,
    following,
    followers,
    setFollow,
    setFollowing,
    setFollowers,
    setOpenWarning,
  } = useContext(ModalContext);

  const [loading, setLoading] = useState(false);
  const [mutedStates, setMutedStates] = useState(true);

  // Profil username ni ajratib olish (bo'limlarni e'tiborsiz qoldirish)
  const getUsernameFromPath = (path) => {
    const match = path.match(/^\/@([^\/]+)/);
    return match ? match[1] : null;
  };

  const username = getUsernameFromPath(pathname);

  const handleNavigate = () => {
    navigate(-1);
  };

  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await Backend.get(`${username}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserProfile(res.data);
      setUserPosts(res.data.posts);
    } catch (err) {
      console.error("Xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const followClick = async (data) => {
    if (accessToken === "" && refreshToken === "") {
      setOpenWarning(true);
    } else {
      try {
        const response = await Backend.post(`/follow/${data}`, null, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 201) {
          setFollow(false);
        }
      } catch (err) {
        console.error("Xatolik yuz berdi: ", err);
      }
      getFollowing();
    }
  };

  const getFollowing = async () => {
    const response = await Backend.get(`/${username}/following`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const res = await Backend.get(`/${username}/followers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setFollowing(response.data);
    setFollowers(res.data);
  };

  const handleOpenFollowModal = () => {
    setFollowModal(true);
  };

  useEffect(() => {
    const isFollowers = followers?.followers?.some(
      (user) => user?.username === myProfile?.username
    );

    setFollow(isFollowers);
  }, [followers, userProfile?.username]);

  const isFollowingThem = followers?.followers?.some(
    (user) => user.username === myProfile?.username
  );

  const isFollowedByThem = following?.following?.some(
    (user) => user.username === myProfile?.username
  );

  // Bu holda: ular meni follow qilishgan, lekin men ularni qilmaganman
  const shouldFollowBack = isFollowedByThem && !isFollowingThem;

  useEffect(() => {
    getFollowing();
    getProfile();
  }, [username]);

  return (
    <div className="profile">
      {userProfile?.is_owner === true ? (
        <>
          <div className="profile__header">
            <NavLink className="title">Профиль</NavLink>
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
                          style={{ borderRadius: "50%", objectFit: "cover" }}
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
                          <button
                            className="follow-count"
                            onClick={handleOpenFollowModal}
                          >
                            <span>59 подписчиков</span>
                          </button>
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
          <div className="user__profile-header">
            <button className="prev__btn" onClick={() => handleNavigate()}>
              <PrevIcon />
            </button>
            <NavLink className="header">{userProfile?.username}</NavLink>
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
                          style={{ borderRadius: "50%", objectFit: "cover" }}
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
                    <button
                      className={`follow-btn ${follow ? "active" : ""}`}
                      onClick={() => followClick(userProfile?.username)}
                    >
                      {follow
                        ? "Подписки"
                        : shouldFollowBack
                        ? "Подписаться в ответ"
                        : "Подписаться"}
                    </button>
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
