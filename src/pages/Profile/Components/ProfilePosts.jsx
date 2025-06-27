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
import NotInterestingIcon from "../../../assets/icons/NotInterestingIcon";
import BlokIcon from "../../../assets/icons/BlokIcon";
import ComplainIcon from "../../../assets/icons/ComplainIcon";
import LinkCopyIcon from "../../../assets/icons/LinkCopyIcon";
import StatisticsIcon from "../../../assets/icons/StatisticsIcon";
import { Backend } from "../../../api";
import { Link, useLocation } from "react-router-dom";
import { baseURL } from "../../../constants/urls";

function ProfilePosts() {
  const videoRefs = useRef([]);
  const menuRef = useRef(null);
  const profileMainRef = useRef(null);

  const { showLoading } = useContext(ModalContext);
  const { userLocalData } = useContext(AuthContext);
  const { addFavorites, favorite } = useContext(FavoriteContext);

  const [animatedCounts, setAnimatedCounts] = useState({});
  const [activePostId, setActivePostId] = useState(null);
  const [mutedStates, setMutedStates] = useState({});
  const [timeLeft, setTimeLeft] = useState({});
  const [myPosts, setMyPosts] = useState([]);

  const getMyPosts = () => {
    Backend.get(`${userLocalData?.username}`).then((res) => {
      setMyPosts(res.data.posts);
    });
  };

  const location = useLocation();

  // Har bir post uchun qolgan vaqtni hisoblash
  const calculateTimeLeft = () => {
    const newTimeLeft = {};
    myPosts.forEach((post) => {
      if (post.createdAt) {
        const postTime = new Date(post.createdAt);
        const currentTime = new Date();
        const diffInMilliseconds = currentTime - postTime;
        const minutesLeft = 15 - Math.floor(diffInMilliseconds / (1000 * 60));
        const secondsLeft = 60 - Math.floor((diffInMilliseconds / 1000) % 60);

        newTimeLeft[post.id] = {
          minutes: Math.max(0, minutesLeft),
          seconds: minutesLeft >= 0 ? secondsLeft : 0,
        };
      }
    });
    setTimeLeft(newTimeLeft);
  };

  useEffect(() => {
    calculateTimeLeft();

    // Har sekundda yangilash (aniqroq hisoblash uchun)
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [myPosts]);

  const handleInfoModal = (data) => {
    setActivePostId(data);
  };

  const openModal = () => {
    showLoading();
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
    myPosts.forEach((pItem, pIndex) => {
      pItem?.videos?.forEach((_, vIndex) => {
        const key = `${pIndex}-${vIndex}`;
        newStates[key] = true;
      });
    });
    setMutedStates(newStates);
  }, [myPosts]);

  // console.log(myPosts);

  useEffect(() => {
    getMyPosts();
  }, []);

  return (
    <div className="posts" ref={profileMainRef}>
      <div className="posts__publish">
        <img
          width={45}
          height={45}
          style={{ borderRadius: "24px" }}
          src={
            userLocalData?.photo === null
              ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
              : userLocalData?.photo
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
                      userLocalData?.photo === null
                        ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
                        : userLocalData?.photo
                    }
                    alt="img"
                  />
                </div>
                <div className="content__wrap">
                  <div className="header__wrapper">
                    <p className="user__name">{item?.author?.username}</p>
                    <button
                      className="dots__menu"
                      onClick={() => handleInfoModal(item.uid)}
                    >
                      <span>
                        <DotsIcon />
                      </span>
                    </button>
                  </div>
                  {activePostId === item?.uid && (
                    <div className="post__menu-modal" ref={menuRef}>
                      <ul className="post__menu-list">
                        <li className="this__other">
                          <span>Статистика</span>
                          <StatisticsIcon />
                        </li>
                        <span className="line"></span>

                        <li className="this__other">
                          <span>Редактировать</span>
                        </li>

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
                              src={`${baseURL.url}${i.media}`}
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
                            src={`${baseURL.url}${i.media}`}
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
  );
}

export default ProfilePosts;
