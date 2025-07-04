import React, { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "../../contexts/ModalContext";
import HeartActionIcon from "../../assets/icons/HeartActionIcon";
import CommentIcon from "../../assets/icons/CommentIcon";
import DotsIcon from "../../assets/icons/DotsIcon";
import { FavoriteContext } from "../../contexts/FavoriteContext";
import SaveIcon from "../../assets/icons/SaveIcon";
import NotInterestingIcon from "../../assets/icons/NotInterestingIcon";
import BlokIcon from "../../assets/icons/BlokIcon";
import LinkCopyIcon from "../../assets/icons/LinkCopyIcon";
import ComplainIcon from "../../assets/icons/ComplainIcon";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { FreeMode } from "swiper/modules";
import "swiper/css/free-mode";
import VolumeMutedIcon from "../../assets/icons/VolumeMutedIcon";
import VolumeIcon from "../../assets/icons/VolumeIcon";
import { formatDistanceToNow } from "date-fns";
import RepostIcon from "../../assets/icons/RepostIcon";
import SendIcon from "../../assets/icons/SendIcon";
import { Backend } from "../../api";
import { message } from "antd";
SwiperCore.use([FreeMode]);

function DashboardPage() {
  const videoRefs = useRef([]);
  const menuRef = useRef(null);
  const dashboardMainRef = useRef(null);
  const textareaRef = useRef(null);

  const { showLoading, post, setPost, getPosts, loading } =
    useContext(ModalContext);
  const { addFavorites, favorite } = useContext(FavoriteContext);
  const { myProfile, accessToken, refreshToken } = useContext(AuthContext);

  const [animatedCounts, setAnimatedCounts] = useState({});
  const [activePostUid, setActivePostUid] = useState(null);
  const [mutedStates, setMutedStates] = useState({});
  const [comment, setComment] = useState(null);
  const [value, setValue] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const isCommentDisabled = value.trim();

  const handleCommentOpen = (data) => {
    setValue("");
    if (comment?.uid === undefined) {
      setComment(data);
    } else if (comment?.uid === data?.uid) {
      setComment(null);
    } else if (comment?.uid !== data?.uid) {
      setComment(data);
      setValue("");
    }
  };

  useEffect(() => {
    if (!comment) {
      setValue("");
    }
  }, [comment]);

  const handleSubmitComment = (uid) => {
    setCommentLoading(true);
    const formData = new FormData();

    formData.append("content", value);

    Backend.post(`/posts/${uid}/comments`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        if (res.status == 201) {
          // Post ro'yxatini yangilash (comments_count +1)
          setPost((prevPosts) =>
            prevPosts.map((post) =>
              post.uid === uid
                ? { ...post, comments_count: post.comments_count + 1 }
                : post
            )
          );
          setValue("");
          setComment(null);
          // message.success("Publication announced");
          message.success("Nashr qilindi");
        }
      })
      .finally(() => {
        setCommentLoading(false);
      });
  };

  const openModal = () => {
    showLoading();
  };

  const handleInfoModal = (data) => {
    setActivePostUid(data);
  };

  const handleFavorite = (data) => {
    const isLiked = favorite.some((item) => item.uid === data.uid);
    const updatedLikesCount = isLiked
      ? Math.max(0, data.likes_count - 1)
      : data.likes_count + 1;

    setAnimatedCounts((prev) => ({
      ...prev,
      [data.uid]: {
        value: updatedLikesCount,
        animate: true,
      },
    }));

    setTimeout(() => {
      setAnimatedCounts((prev) => ({
        ...prev,
        [data.uid]: {
          ...prev[data.uid],
          animate: false,
        },
      }));
    }, 600);

    // Yangilangan data obyektini yuboramiz
    const updatedData = { ...data, likes_count: updatedLikesCount };
    addFavorites(updatedData, isLiked);
    // Muted state o'zgarishiga ta'sir qilmaslik uchun
    setMutedStates((prev) => ({ ...prev }));
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
        setActivePostUid(null);
      }
    };

    const handleScroll = () => {
      setActivePostUid(null);
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
        if (!(key in mutedStates)) {
          newStates[key] = true;
        }
      });
    });
    setMutedStates((prev) => ({ ...prev, ...newStates }));
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
      { threshold: 0.6 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [post]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [value]);

  useEffect(() => {
    getPosts();
  }, []);

  return loading ? (
    <div className="loader__wrap">
      <div className="loader"></div>
    </div>
  ) : (
    <div className="dashboard">
      <div className="dashboard__header">
        <h3 className="title">Для вас</h3>
      </div>
      <div className="dashboard__main" ref={dashboardMainRef}>
        {accessToken !== "" && refreshToken !== "" ? (
          <>
            <div className="dashboard__publish">
              <Link to={`/@${myProfile?.username}`}>
                <img
                  width={45}
                  height={45}
                  style={{ borderRadius: "24px", cursor: "pointer" }}
                  src={
                    myProfile?.photo === null
                      ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
                      : myProfile?.photo
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
          </>
        ) : null}

        {post?.map((item, postIndex) => {
          const isLiked = favorite.some((fav) => fav.uid === item.uid);
          return (
            <div className="posts-list" key={item.uid}>
              <div className="posts__list-wrap">
                <div className="posts__list-item">
                  <div className="img__wrap">
                    <img
                      width={40}
                      height={40}
                      style={{ borderRadius: "24px" }}
                      src={
                        item?.author?.photo === null
                          ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
                          : item?.author?.photo
                      }
                      alt="img"
                    />
                    {comment?.uid === item?.uid ? (
                      <div className="img__bottom-line"></div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="content__wrap">
                    <div className="header__wrapper">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "end",
                          gap: "8px",
                        }}
                      >
                        <Link
                          to={`/@${item?.author?.username}`}
                          className="user__name"
                        >
                          {item?.author?.username}
                        </Link>
                        <div style={{ color: "#717171", fontSize: "14px" }}>
                          {formatDistanceToNow(new Date(item.created_at), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                      <button
                        className="dots__menu"
                        onClick={() => handleInfoModal(item?.uid)}
                      >
                        <span>
                          <DotsIcon />
                        </span>
                      </button>
                    </div>
                    {activePostUid === item?.uid && (
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
                    {item?.content && (
                      <p className="post__text">{item?.content}</p>
                    )}

                    {(item?.videos?.length > 0 || item?.images?.length > 0) && (
                      <Swiper
                        spaceBetween={6}
                        slidesPerView={"auto"}
                        freeMode={true}
                        grabCursor={true}
                        style={{ padding: "4px 0" }}
                      >
                        <SwiperSlide
                          style={{
                            borderRadius: "8px",
                          }}
                        >
                          <div className="media__wrap" key={item?.uid}>
                            {item?.videos?.map((i, videoIndex) => {
                              if (!i?.media) return null;
                              const key = `${postIndex}-${videoIndex}`;
                              const refIndex = postIndex * 1000 + videoIndex;
                              return (
                                <div
                                  className="video__wrap"
                                  style={{
                                    width:
                                      item?.videos?.length === 1 &&
                                      item?.images?.length === 0
                                        ? "350px"
                                        : "300px",
                                    height:
                                      item?.videos?.length === 1 &&
                                      item?.images?.length === 0
                                        ? "430px"
                                        : "340px",
                                    position: "relative",
                                    flexShrink: 0,
                                  }}
                                >
                                  <video
                                    ref={(el) => {
                                      if (el) videoRefs.current[refIndex] = el;
                                    }}
                                    src={i?.media}
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

                            {item?.images?.map((i) => (
                              <div
                                className="image__wrap"
                                style={{
                                  width: `${
                                    item?.images?.length === 1 &&
                                    item?.videos?.length === 0
                                      ? "330px"
                                      : "320px"
                                  }`,
                                  height: `${
                                    item?.images?.length === 1 &&
                                    item?.videos?.length === 0
                                      ? "400px"
                                      : "340px"
                                  }`,
                                }}
                              >
                                <img
                                  src={i.media}
                                  alt="image"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </SwiperSlide>
                      </Swiper>
                    )}

                    <div className="actions">
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
                            {item?.likes_count === 0 ? (
                              <></>
                            ) : (
                              <span
                                className={
                                  animatedCounts[item.uid]?.animate
                                    ? "like-anim"
                                    : ""
                                }
                                style={{
                                  color: isLiked ? "red" : "#fff",
                                  fontSize: "17px",
                                  marginTop: "4px",
                                }}
                              >
                                {item?.likes_count}
                              </span>
                            )}
                          </button>
                        </div>
                        <button
                          className="comment__action"
                          onClick={() => handleCommentOpen(item)}
                        >
                          <p className="actions__icon">
                            <CommentIcon />
                            {item?.comments_count === 0 ? (
                              <></>
                            ) : (
                              <span
                                style={{ fontSize: "17px", marginTop: "4px" }}
                              >
                                {item?.comments_count}
                              </span>
                            )}
                          </p>
                        </button>
                        <button className="share__action">
                          <p className="actions__icon">
                            <RepostIcon />
                            {item?.views_count === 0 ? (
                              <></>
                            ) : (
                              <span
                                style={{ fontSize: "17px", marginTop: "4px" }}
                              >
                                {item?.views_count}
                              </span>
                            )}
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {comment?.uid === item?.uid ? (
                  <div>
                    <div className="comment__open">
                      <div className="info__wrap">
                        <img
                          width={40}
                          height={40}
                          src={
                            myProfile?.photo === null
                              ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
                              : myProfile?.photo
                          }
                          alt="user-img"
                          style={{ borderRadius: "24px" }}
                        />
                        <div style={{ flex: 1 }}>
                          <p className="username">{myProfile?.username}</p>
                          <textarea
                            className="textarea"
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={`Ответьте ${comment?.author?.username}…`}
                          ></textarea>
                        </div>
                      </div>
                      {isCommentDisabled ? (
                        <button
                          className="submit-btn-wrap"
                          onClick={() => handleSubmitComment(item?.uid)}
                          disabled={commentLoading}
                          style={{
                            cursor: commentLoading ? "not-allowed" : "",
                          }}
                        >
                          {commentLoading ? (
                            <div className="loader__btn"></div>
                          ) : (
                            <SendIcon />
                          )}
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardPage;
