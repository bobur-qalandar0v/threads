// import React, { useContext, useEffect, useRef, useState } from "react";
// import { ModalContext } from "../../contexts/ModalContext";
// import VolumeMutedIcon from "../../assets/icons/VolumeMutedIcon";
// import VolumeIcon from "../../assets/icons/VolumeIcon";
// import HeartActionIcon from "../../assets/icons/HeartActionIcon";
// import CommentIcon from "../../assets/icons/CommentIcon";
// import ShareIcon from "../../assets/icons/ShareIcon";
// import DotsIcon from "../../assets/icons/DotsIcon";
// import { FavoriteContext } from "../../contexts/FavoriteContext";
// import SaveIcon from "../../assets/icons/SaveIcon";
// import NotInterestingIcon from "../../assets/icons/NotInterestingIcon";
// import BlokIcon from "../../assets/icons/BlokIcon";
// import LinkCopyIcon from "../../assets/icons/LinkCopyIcon";
// import ComplainIcon from "../../assets/icons/ComplainIcon";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../../contexts/AuthContext";

// function DashboardPage() {
//   const videoRefs = useRef([]);
//   const menuRef = useRef(null);
//   const dashboardMainRef = useRef(null);

//   const { showLoading, post, getPosts, loading } = useContext(ModalContext);
//   const { addFavorites, favorite } = useContext(FavoriteContext);
//   const { myProfile, accessToken, refreshToken } = useContext(AuthContext);

//   const [animatedCounts, setAnimatedCounts] = useState({});
//   const [activePostUid, setActivePostUid] = useState(null);
//   const [mutedStates, setMutedStates] = useState({});

//   const openModal = () => {
//     showLoading();
//   };

//   const handleInfoModal = (data) => {
//     setActivePostUid(data);
//   };

//   const handleFavorite = (data) => {
//     const isLiked = favorite.some((item) => item.uid === data.uid);
//     const updatedLikesCount = isLiked
//       ? Math.max(0, data.likes_count - 1)
//       : data.likes_count + 1;

//     setAnimatedCounts((prev) => ({
//       ...prev,
//       [data.uid]: {
//         value: updatedLikesCount,
//         animate: true,
//       },
//     }));

//     setTimeout(() => {
//       setAnimatedCounts((prev) => ({
//         ...prev,
//         [data.uid]: {
//           ...prev[data.uid],
//           animate: false,
//         },
//       }));
//     }, 600);

//     // Shu yerda data object’ni yangilab, addFavorites ga yuboramiz
//     const updatedData = { ...data, likes_count: updatedLikesCount };
//     addFavorites(updatedData, isLiked); // yangi like soni bor
//   };

//   const handleMute = (postIndex, videoIndex) => {
//     const clickedKey = `${postIndex}-${videoIndex}`;
//     const updatedStates = {};

//     Object.keys(mutedStates).forEach((key) => {
//       updatedStates[key] = key === clickedKey ? !mutedStates[key] : true;
//     });

//     setMutedStates(updatedStates);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setActivePostUid(null);
//       }
//     };

//     const handleScroll = () => {
//       setActivePostUid(null);
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     if (dashboardMainRef.current) {
//       dashboardMainRef.current.addEventListener("scroll", handleScroll);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       if (dashboardMainRef.current) {
//         dashboardMainRef.current.removeEventListener("scroll", handleScroll);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const newStates = {};
//     post.forEach((pItem, pIndex) => {
//       pItem?.videos?.forEach((_, vIndex) => {
//         const key = `${pIndex}-${vIndex}`;
//         if (!(key in mutedStates)) {
//           newStates[key] = true;
//         }
//       });
//     });
//     setMutedStates((prev) => ({ ...prev, ...newStates }));
//   }, [post]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           const video = entry.target;
//           if (entry.isIntersecting) {
//             video.play().catch(() => {});
//           } else {
//             video.pause();
//           }
//         });
//       },
//       { threshold: 0.5 }
//     );

//     videoRefs.current.forEach((video) => {
//       if (video) observer.observe(video);
//     });

//     return () => observer.disconnect();
//   }, [post]);

//   useEffect(() => {
//     getPosts();
//   }, []);

//   return loading ? (
//     <div className="loader__wrap">
//       <div className="loader"></div>
//     </div>
//   ) : (
//     <div className="dashboard">
//       <div className="dashboard__header">
//         <h3 className="title">Для вас</h3>
//       </div>
//       <div className="dashboard__main" ref={dashboardMainRef}>
//         {accessToken !== "" && refreshToken !== "" ? (
//           <>
//             <div className="dashboard__publish">
//               <Link to={`/${myProfile?.username}`}>
//                 <img
//                   width={45}
//                   height={45}
//                   style={{ borderRadius: "24px", cursor: "pointer" }}
//                   src={
//                     myProfile?.photo === null
//                       ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
//                       : myProfile?.photo
//                   }
//                   alt="profile-img"
//                 />
//               </Link>
//               <p className="dashboard__p" onClick={openModal}>
//                 Что нового?
//               </p>
//               <button className="dashboard__btn" onClick={openModal}>
//                 Опубликовать
//               </button>
//             </div>
//             <span className="publish__line"></span>
//           </>
//         ) : null}

//         {post?.map((item, postIndex) => {
//           const isLiked = favorite.some((fav) => fav.uid === item.uid);
//           return (
//             <div className="posts-list" key={postIndex}>
//               <div className="posts__list-wrap">
//                 <div className="posts__list-item">
//                   <div className="img__wrap">
//                     <img
//                       width={40}
//                       height={40}
//                       style={{ borderRadius: "24px" }}
//                       src={
//                         item?.author?.photo === null
//                           ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
//                           : item?.author?.photo
//                       }
//                       alt="img"
//                     />
//                   </div>
//                   <div className="content__wrap">
//                     <div className="header__wrapper">
//                       <Link
//                         to={
//                           myProfile?.username === item?.author?.username
//                             ? `/@${myProfile?.username}`
//                             : `/user/@${item?.author?.username}`
//                         }
//                         className="user__name"
//                       >
//                         {item?.author?.username}
//                       </Link>
//                       <button
//                         className="dots__menu"
//                         onClick={() => handleInfoModal(item?.uid)}
//                       >
//                         <span>
//                           <DotsIcon />
//                         </span>
//                       </button>
//                     </div>
//                     {activePostUid === item?.uid && (
//                       <div className="post__menu-modal" ref={menuRef}>
//                         <ul className="post__menu-list">
//                           <li className="this__other">
//                             <span>Сохранить</span>
//                             <SaveIcon />
//                           </li>
//                           <li
//                             className="this__other"
//                             style={{ marginBottom: "8px" }}
//                           >
//                             <span>Не интересует</span>
//                             <NotInterestingIcon />
//                           </li>
//                           <span className="line"></span>
//                           <li className="other">
//                             <span>Заблокировать</span>
//                             <BlokIcon />
//                           </li>
//                           <li className="shikoyat">
//                             <span>Пожаловаться</span>
//                             <ComplainIcon />
//                           </li>
//                           <span className="line"></span>
//                           <li
//                             className="this__other"
//                             style={{ marginTop: "16px" }}
//                           >
//                             <span>Копировать ссылку</span>
//                             <LinkCopyIcon />
//                           </li>
//                         </ul>
//                       </div>
//                     )}
//                     {item?.content && (
//                       <p className="post__text">{item?.content}</p>
//                     )}

//                     {(item?.videos?.length > 0 || item?.images?.length > 0) && (

//                       <div className="media__wrap" key={item?.uid}>
//                         {item?.videos?.map((i, videoIndex) => {
//                           if (!i?.media) return null;
//                           const key = `${postIndex}-${videoIndex}`;
//                           const refIndex = postIndex * 1000 + videoIndex;
//                           return (
//                             <div
//                               className="video__wrap"
//                               style={{
//                                 width:
//                                   item?.videos?.length === 1 &&
//                                   item?.images?.length === 0
//                                     ? "350px"
//                                     : "260px",
//                                 height:
//                                   item?.videos?.length === 1 &&
//                                   item?.images?.length === 0
//                                     ? "430px"
//                                     : "320px",
//                                 position: "relative",
//                                 flexShrink: 0,
//                               }}
//                             >
//                               <video
//                                 ref={(el) => {
//                                   if (el) videoRefs.current[refIndex] = el;
//                                 }}
//                                 src={i?.media}
//                                 muted={mutedStates[key]}
//                                 loop
//                                 playsInline
//                                 autoPlay
//                                 style={{
//                                   width: "100%",
//                                   height: "100%",
//                                   objectFit: "cover",
//                                   borderRadius: "8px",
//                                 }}
//                               />
//                               <button
//                                 className="volume__muted-btn"
//                                 onClick={() =>
//                                   handleMute(postIndex, videoIndex)
//                                 }
//                               >
//                                 {mutedStates[key] ? (
//                                   <VolumeMutedIcon />
//                                 ) : (
//                                   <VolumeIcon />
//                                 )}
//                               </button>
//                             </div>
//                           );
//                         })}

//                         {item?.images?.map((i) => (
//                           <div
//                             className="image__wrap"
//                             style={{
//                               width: `${
//                                 item?.images?.length === 1 &&
//                                 item?.videos?.length === 0
//                                   ? "300px"
//                                   : "320px"
//                               }`,
//                               height: `${
//                                 item?.images?.length === 1 &&
//                                 item?.videos?.length === 0
//                                   ? "320px"
//                                   : "320px"
//                               }`,
//                               flexShrink: 0,
//                             }}
//                           >
//                             <img
//                               src={i.media}
//                               alt="image"
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: "cover",
//                                 borderRadius: "8px",
//                               }}
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     <div className="actions">
//                       <div className="actions__wrap">
//                         <div className="heart__action">
//                           <button
//                             className="actions__icon"
//                             onClick={() => handleFavorite(item)}
//                           >
//                             <HeartActionIcon
//                               style={{
//                                 fill: isLiked ? "red" : "none",
//                                 stroke: isLiked ? "red" : "#fff",
//                               }}
//                             />
//                             <span
//                               className={
//                                 animatedCounts[item.uid]?.animate
//                                   ? "like-anim"
//                                   : ""
//                               }
//                               style={{
//                                 color: `${isLiked ? "red" : "#fff"}`,
//                                 fontSize: "17px",
//                                 marginTop: "4px",
//                               }}
//                             >
//                               {item?.likes_count === 0
//                                 ? null
//                                 : item?.likes_count}
//                             </span>
//                           </button>
//                         </div>
//                         <div className="comment__action">
//                           <button className="actions__icon">
//                             <CommentIcon />
//                             <span style={{ fontSize: "17px" }}>
//                               {item?.comments_count === 0
//                                 ? null
//                                 : item?.comments_count}
//                             </span>
//                           </button>
//                         </div>
//                         <div className="share__action">
//                           <button className="actions__icon">
//                             <ShareIcon />
//                             <span style={{ fontSize: "17px" }}>
//                               {item?.views_count === 0
//                                 ? null
//                                 : item?.views_count}
//                             </span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
// export default DashboardPage;

///////////////////////////////////////////////////////

import React, { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "../../contexts/ModalContext";
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
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { FreeMode } from "swiper/modules";
import "swiper/css/free-mode";
import VolumeMutedIcon from "../../assets/icons/VolumeMutedIcon";
import VolumeIcon from "../../assets/icons/VolumeIcon";
import { Backend } from "../../api";
import { formatDistanceToNow } from "date-fns";
SwiperCore.use([FreeMode]);

function DashboardPage() {
  const videoRefs = useRef([]);
  const menuRef = useRef(null);
  const dashboardMainRef = useRef(null);

  const navigate = useNavigate();

  const { showLoading, post, getPosts, loading } = useContext(ModalContext);
  const { addFavorites, favorite } = useContext(FavoriteContext);
  const { myProfile, accessToken, refreshToken } = useContext(AuthContext);

  const [animatedCounts, setAnimatedCounts] = useState({});
  const [activePostUid, setActivePostUid] = useState(null);
  const [mutedStates, setMutedStates] = useState({});

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
                          to={
                            myProfile?.username === item?.author?.username
                              ? `/@${myProfile?.username}`
                              : `/user/@${item?.author?.username}`
                          }
                          className="user__name"
                        >
                          {item?.author?.username}
                        </Link>
                        <div style={{ color: "#717171", fontSize: "14px" }}>
                          {" "}
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
    </div>
  );
}

export default DashboardPage;
