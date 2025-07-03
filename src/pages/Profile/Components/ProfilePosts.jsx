import React, { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "../../../contexts/ModalContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { FavoriteContext } from "../../../contexts/FavoriteContext";
import DotsIcon from "../../../assets/icons/DotsIcon";
import HeartActionIcon from "../../../assets/icons/HeartActionIcon";
import CommentIcon from "../../../assets/icons/CommentIcon";
import ShareIcon from "../../../assets/icons/ShareIcon";
import VolumeIcon from "../../../assets/icons/VolumeIcon";
import VolumeMutedIcon from "../../../assets/icons/VolumeMutedIcon";
import SaveIcon from "../../../assets/icons/SaveIcon";
import LinkCopyIcon from "../../../assets/icons/LinkCopyIcon";
import StatisticsIcon from "../../../assets/icons/StatisticsIcon";
import { useLocation } from "react-router-dom";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import { formatDistanceToNow } from "date-fns";

function ProfilePosts() {
  const videoRefs = useRef([]);
  const menuRef = useRef(null);
  const profileMainRef = useRef(null);
  const location = useLocation();

  const { showLoading } = useContext(ModalContext);
  const { myProfile, myPosts, userProfile, userPosts, loading } =
    useContext(AuthContext);
  const { addFavorites, favorite } = useContext(FavoriteContext);

  const [showEditOptions, setShowEditOptions] = useState({});
  const [animatedCounts, setAnimatedCounts] = useState({});
  const [activePostId, setActivePostId] = useState(null);
  const [mutedStates, setMutedStates] = useState({});
  const [timeLeft, setTimeLeft] = useState({});

  const openModal = () => {
    showLoading();
  };
  const handleInfoModal = (postId) => {
    setActivePostId(activePostId === postId ? null : postId);
  };

  const handleFavorite = (post) => {
    const isLiked = favorite.some((item) => item.uid === post.uid);
    const updatedLikesCount = isLiked
      ? post.likes_count - 1
      : post.likes_count + 1;

    setAnimatedCounts((prev) => ({
      ...prev,
      [post.uid]: {
        value: updatedLikesCount,
        animate: true,
      },
    }));

    setTimeout(() => {
      setAnimatedCounts((prev) => ({
        ...prev,
        [post.uid]: {
          ...prev[post.uid],
          animate: false,
        },
      }));
    }, 600);

    addFavorites({ ...post, likes_count: updatedLikesCount }, isLiked);
  };

  const handleMute = (postIndex, videoIndex) => {
    const key = `${postIndex}-${videoIndex}`;
    setMutedStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Vaqtni hisoblash va edit imkoniyatini yangilash
  const updateTimers = () => {
    const newTimeLeft = {};
    const newShowEditOptions = {};

    myPosts?.forEach((post) => {
      if (post.created_at) {
        const postDate = new Date(post.created_at);
        const now = new Date();
        const diffMs = now - postDate;
        const diffMins = Math.floor(diffMs / (1000 * 60));

        // 15 daqiqadan kam vaqt qolganligini hisoblash
        const minsLeft = Math.max(0, 15 - diffMins);
        const secsLeft =
          minsLeft > 0 ? 59 - Math.floor((diffMs / 1000) % 60) : 0;

        newTimeLeft[post.uid] = {
          mins: minsLeft,
          secs: secsLeft,
        };

        // 15 daqiqadan o'tmagan postlar uchun edit imkoniyati
        newShowEditOptions[post.uid] = diffMins < 15;
      }
    });

    setTimeLeft(newTimeLeft);
    setShowEditOptions(newShowEditOptions);
  };

  useEffect(() => {
    updateTimers();
    const timerInterval = setInterval(updateTimers, 1000);
    return () => clearInterval(timerInterval);
  }, [myPosts]);

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
    if (profileMainRef.current) {
      profileMainRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (profileMainRef.current) {
        profileMainRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const newStates = {};
    myPosts?.forEach((pItem, pIndex) => {
      pItem?.videos?.forEach((_, vIndex) => {
        const key = `${pIndex}-${vIndex}`;
        newStates[key] = true;
      });
    });
    setMutedStates(newStates);
  }, [myPosts]);

  const renderPostMenu = (post) => {
    const canEdit = showEditOptions[post.uid] ?? false;
    const timeRemaining = timeLeft[post.uid] || { mins: 0, secs: 0 };

    return (
      <div className="post__menu-modal" ref={menuRef}>
        <ul className="post__menu-list">
          <div className="post__menu-list-wrap statistic">
            <li className="this__other">
              <span>Статистика</span>
              <StatisticsIcon />
            </li>
          </div>
          {canEdit ? <div className="line"></div> : null}

          {canEdit && (
            <>
              <div className="post__menu-list-wrap edit">
                <li className="this__other">
                  <span>Редактировать</span>
                  <span className="edit-timer">
                    {timeRemaining.mins}:{timeRemaining.secs < 10 ? "0" : ""}
                    {timeRemaining.secs}
                  </span>
                </li>
              </div>
            </>
          )}

          <div className="post__menu-list-wrap save">
            <li className="this__other">
              <span>Сохранить</span>
              <SaveIcon />
            </li>
          </div>
          <div className="line"></div>

          <div className="post__menu-list-wrap delete">
            <li className="shikoyat">
              <span>Удалить</span>
              <DeleteIcon />
            </li>
          </div>
          <div className="line"></div>

          <div className="post__menu-list-wrap copy">
            <li className="this__other">
              <span>Копировать ссылку</span>
              <LinkCopyIcon />
            </li>
          </div>
        </ul>
      </div>
    );
  };

  // console.log(userPosts)

  return loading ? (
    <div className="loader__wrap">
      <div className="loader"></div>
    </div>
  ) : userProfile?.is_owner === true ? (
    <div className="posts" ref={profileMainRef}>
      <div className="posts__publish">
        <img
          width={80}
          height={50}
          style={{ borderRadius: "24px" }}
          src={
            myProfile?.photo === null
              ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
              : myProfile?.photo
          }
          alt="profile-img"
        />
        <p className="posts__p" onClick={openModal}>
          Что нового?
        </p>
        <button className="posts__btn" onClick={openModal}>
          Опубликовать
        </button>
      </div>

      {myPosts?.map((item, postIndex) => {
        const isLiked = favorite.some((fav) => fav.uid === item.uid);
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
                      myProfile?.photo === null
                        ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
                        : myProfile?.photo
                    }
                    alt="img"
                  />
                </div>
                <div className="content__wrap">
                  <div className="header__wrapper">
                    <div className="user__wrap">
                      <p className="user__name">{item?.author?.username}</p>
                      <div className="post__created-time">
                        {formatDistanceToNow(new Date(item.created_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <button
                      className="dots__menu"
                      onClick={() => handleInfoModal(item.uid)}
                    >
                      <span>
                        <DotsIcon />
                      </span>
                    </button>
                  </div>

                  {activePostId === item?.uid && renderPostMenu(item)}

                  {item?.content && (
                    <p className="post__text">{item?.content}</p>
                  )}
                  {(item?.videos?.length > 0 || item?.images?.length > 0) && (
                    <div className="media__wrap">
                      {item?.videos?.map((i, videoIndex) => {
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
                              src={`${i.media}`}
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
                              onClick={() => handleMute(postIndex, videoIndex)}
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
                            src={`${i.media}`}
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
                          <span
                            className={
                              animatedCounts[item.uid]?.animate
                                ? "like-anim"
                                : ""
                            }
                            style={{
                              color: `${isLiked ? "red" : "#fff"}`,
                              fontSize: "17px",
                              marginTop: "4px",
                            }}
                          >
                            {item?.likes_count === 0 ? null : item?.likes_count}
                          </span>
                        </button>
                      </div>
                      <div className="comment__action">
                        <button className="actions__icon">
                          <CommentIcon />
                          <span style={{ fontSize: "17px" }}>
                            {item?.comments_count === 0
                              ? null
                              : item?.comments_count}
                          </span>
                        </button>
                      </div>
                      <div className="share__action">
                        <button className="actions__icon">
                          <ShareIcon />
                          <span style={{ fontSize: "17px" }}>
                            {item?.views_count === 0 ? null : item?.views_count}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <>
      <div className="posts" ref={profileMainRef}>
        {userPosts?.map((item, postIndex) => {
          const isLiked = favorite.some((fav) => fav.uid === item.uid);
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
                        item?.author?.photo === null
                          ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
                          : item?.author?.photo
                      }
                      alt="img"
                    />
                  </div>
                  <div className="content__wrap">
                    <div className="header__wrapper">
                      <div className="user__wrap">
                        <p className="user__name">{item?.author?.username}</p>
                        <div className="post__created-time">
                          {formatDistanceToNow(new Date(item.created_at), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                      <button
                        className="dots__menu"
                        onClick={() => handleInfoModal(item.uid)}
                      >
                        <span>
                          <DotsIcon />
                        </span>
                      </button>
                    </div>

                    {activePostId === item?.uid && renderPostMenu(item)}

                    {item?.content && (
                      <p className="post__text">{item?.content}</p>
                    )}
                    {(item?.videos?.length > 0 || item?.images?.length > 0) && (
                      <div className="media__wrap">
                        {item?.videos?.map((i, videoIndex) => {
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
                                src={`${i.media}`}
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
                              src={`${i.media}`}
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
                            <span
                              className={
                                animatedCounts[item.uid]?.animate
                                  ? "like-anim"
                                  : ""
                              }
                              style={{
                                color: `${isLiked ? "red" : "#fff"}`,
                                fontSize: "17px",
                                marginTop: "4px",
                              }}
                            >
                              {item?.likes_count === 0
                                ? null
                                : item?.likes_count}
                            </span>
                          </button>
                        </div>
                        <div className="comment__action">
                          <button className="actions__icon">
                            <CommentIcon />
                            <span style={{ fontSize: "17px" }}>
                              {item?.comments_count === 0
                                ? null
                                : item?.comments_count}
                            </span>
                          </button>
                        </div>
                        <div className="share__action">
                          <button className="actions__icon">
                            <ShareIcon />
                            <span style={{ fontSize: "17px" }}>
                              {item?.views_count === 0
                                ? null
                                : item?.views_count}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ProfilePosts;
