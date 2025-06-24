import React, { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "../../contexts/ModalContext";
import VolumeMutedIcon from "../../assets/icons/VolumeMutedIcon";
import VolumeIcon from "../../assets/icons/VolumeIcon";
import HeartActionIcon from "../../assets/icons/HeartActionIcon";
import CommentIcon from "../../assets/icons/CommentIcon";
import ShareIcon from "../../assets/icons/ShareIcon";
import DotsIcon from "../../assets/icons/DotsIcon";
import { FavoriteContext } from "../../contexts/FavoriteContext";
import SaveIcon from "../../assets/icons/SaveIcon";
import NotInterestingIcon from "../../assets/icons/NotInterestingIcon";
import BlokIcon from "../../assets/icons/BlokIcon";
import LinkCopyIcon from "../../assets/icons/LinkCopyIcon";
import ComplainIcon from "../../assets/icons/ComplainIcon";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

function DashboardPage() {
  const videoRefs = useRef([]);

  const menuRef = useRef(null);

  const dashboardMainRef = useRef(null);

  const [animatedCounts, setAnimatedCounts] = useState({});

  const [activePostId, setActivePostId] = useState(null);

  const { showLoading, post, getPosts } = useContext(ModalContext);
  const { addFavorites, favorite } = useContext(FavoriteContext);
  const { userInfo } = useContext(AuthContext);

  const [mutedStates, setMutedStates] = useState({});

  const openModal = () => {
    showLoading();
  };

  const handleInfoModal = (data) => {
    setActivePostId(data);
  };

  const handleFavorite = (data) => {
    setAnimatedCounts((prev) => ({
      ...prev,
      [data.id]: {
        value: favorite.some((item) => item.id === data.id)
          ? Math.max(0, data.actions[0].likeCount - 1)
          : data.actions[0].likeCount + 1,
        animate: true,
      },
    }));

    setTimeout(() => {
      setAnimatedCounts((prev) => ({
        ...prev,
        [data.id]: {
          ...prev[data.id],
          animate: false,
        },
      }));
    }, 600);

    addFavorites(data);
  };

  const handleMute = (postIndex, videoIndex) => {
    const clickedKey = `${postIndex}-${videoIndex}`;
    const updatedStates = {};

    Object.keys(mutedStates).forEach((key) => {
      updatedStates[key] = key === clickedKey ? !mutedStates[key] : true;
    });

    setMutedStates(updatedStates);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActivePostId(null);
      }
    };

    const handleScroll = () => {
      setActivePostId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    if (dashboardMainRef.current) {
      dashboardMainRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (dashboardMainRef.current) {
        dashboardMainRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const newStates = {};
    post.forEach((pItem, pIndex) => {
      pItem?.videos?.forEach((_, vIndex) => {
        const key = `${pIndex}-${vIndex}`;
        newStates[key] = true;
      });
    });
    setMutedStates(newStates);
  }, [post]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [post]);

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h3 className="title">Для вас</h3>
      </div>
      <div className="dashboard__main" ref={dashboardMainRef}>
        <div className="dashboard__publish">
          <Link to={`/${userInfo?.username}`}>
            <img
              width={45}
              height={45}
              style={{ borderRadius: "24px", cursor: "pointer" }}
              src={
                userInfo?.profile_img === ""
                  ? userInfo?.profile_default_img
                  : userInfo?.profile_img
              }
              alt="profile-img"
            />
          </Link>
          <p className="dashboard__p" onClick={openModal}>
            Что нового?
          </p>
          <button className="dashboard__btn" onClick={openModal}>
            Опубликовать
          </button>
        </div>
        <span className="publish__line"></span>

        {post?.map((item, postIndex) => {
          const isLiked = favorite.some((fav) => fav.id === item.id);
          return (
            <div className="posts-list" key={postIndex}>
              <div className="posts__list-wrap">
                <div className="posts__list-item">
                  <div className="img__wrap">
                    <img
                      width={40}
                      height={40}
                      style={{ borderRadius: "24px" }}
                      src={
                        userInfo?.profile_img === ""
                          ? userInfo?.profile_default_img
                          : userInfo?.profile_img
                      }
                      alt="img"
                    />
                  </div>
                  <div className="content__wrap">
                    <div className="header__wrapper">
                      <Link
                        to={
                          userInfo?.username === item.nickName
                            ? `/${userInfo?.username}`
                            : `/user/${item?.nickName}`
                        }
                        className="user__name"
                      >
                        {item.nickName}
                      </Link>
                      <button
                        className="dots__menu"
                        onClick={() => handleInfoModal(item.id)}
                      >
                        <span>
                          <DotsIcon />
                        </span>
                      </button>
                    </div>
                    {activePostId === item?.id && (
                      <div className="post__menu-modal" ref={menuRef}>
                        <ul className="post__menu-list">
                          <li className="this__other">
                            <span>Сохранить</span>
                            <SaveIcon />
                          </li>
                          <li
                            className="this__other"
                            style={{ marginBottom: "8px" }}
                          >
                            <span>Не интересует</span>
                            <NotInterestingIcon />
                          </li>
                          <span className="line"></span>
                          <li className="other">
                            <span>Заблокировать</span>
                            <BlokIcon />
                          </li>
                          <li className="shikoyat">
                            <span>Пожаловаться</span>
                            <ComplainIcon />
                          </li>
                          <span className="line"></span>
                          <li
                            className="this__other"
                            style={{ marginTop: "16px" }}
                          >
                            <span>Копировать ссылку</span>
                            <LinkCopyIcon />
                          </li>
                        </ul>
                      </div>
                    )}
                    {item?.text && <p className="post__text">{item.text}</p>}

                    {(item?.videos?.length > 0 || item?.images?.length > 0) && (
                      <div className="media__wrap" key={item?.id}>
                        {item?.videos?.map((i, videoIndex) => {
                          if (!i?.url) return null;
                          const key = `${postIndex}-${videoIndex}`;
                          const refIndex = postIndex * 1000 + videoIndex;
                          return (
                            <div
                              key={i.id}
                              className="video__wrap"
                              style={{
                                width:
                                  item?.videos?.length === 1 &&
                                  item?.images?.length === 0
                                    ? "350px"
                                    : "260px",
                                height:
                                  item?.videos?.length === 1 &&
                                  item?.images?.length === 0
                                    ? "430px"
                                    : "320px",
                                position: "relative",
                                flexShrink: 0,
                              }}
                            >
                              <video
                                ref={(el) => {
                                  if (el) videoRefs.current[refIndex] = el;
                                }}
                                src={i.url}
                                muted={mutedStates[key]}
                                loop
                                playsInline
                                autoPlay
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                              <button
                                className="volume__muted-btn"
                                onClick={() =>
                                  handleMute(postIndex, videoIndex)
                                }
                              >
                                {mutedStates[key] ? (
                                  <VolumeMutedIcon />
                                ) : (
                                  <VolumeIcon />
                                )}
                              </button>
                            </div>
                          );
                        })}

                        {item?.images?.map((i) =>
                          !i?.url ? null : (
                            <div
                              key={i.id}
                              className="image__wrap"
                              style={{
                                width: `${
                                  item?.images?.length === 1 &&
                                  item?.videos?.length === 0
                                    ? "300px"
                                    : "320px"
                                }`,
                                height: `${
                                  item?.images?.length === 1 &&
                                  item?.videos?.length === 0
                                    ? "320px"
                                    : "320px"
                                }`,
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={i.url}
                                alt="image"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {item?.actions?.map((i) => (
                      <div className="actions" key={i.id}>
                        <div className="actions__wrap">
                          <div className="heart__action">
                            <button
                              className="actions__icon"
                              onClick={() => handleFavorite(item)}
                            >
                              <HeartActionIcon
                                style={{
                                  fill: isLiked ? "red" : "none",
                                  stroke: isLiked ? "red" : "#fff",
                                }}
                              />
                              <span
                                className={
                                  animatedCounts[item.id]?.animate
                                    ? "like-anim"
                                    : ""
                                }
                                style={{
                                  color: `${isLiked ? "red" : "#fff"}`,
                                  fontSize: "17px",
                                  marginTop: "4px",
                                }}
                              >
                                {i.likeCount === 0 ? null : i.likeCount}
                              </span>
                            </button>
                          </div>
                          <div className="comment__action">
                            <button className="actions__icon">
                              <CommentIcon />
                              <span style={{ fontSize: "17px" }}>
                                {i.comentCount === 0 ? null : i.comentCount}
                              </span>
                            </button>
                          </div>
                          <div className="share__action">
                            <button className="actions__icon">
                              <ShareIcon />
                              <span style={{ fontSize: "17px" }}>
                                {i.shareCount === 0 ? null : i.shareCount}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardPage;
