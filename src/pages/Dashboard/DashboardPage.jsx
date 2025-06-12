import React, { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "../../contexts/ModalContext";
import VolumeMutedIcon from "../../assets/icons/VolumeMutedIcon";
import VolumeIcon from "../../assets/icons/VolumeIcon";
import HeartActionIcon from "../../assets/icons/HeartActionIcon";
import CommentIcon from "../../assets/icons/CommentIcon";
import ShareIcon from "../../assets/icons/ShareIcon";
import DotsIcon from "../../assets/icons/DotsIcon";

function DashboardPage() {
  const videoRefs = useRef([]);
  const { showLoading, post, getPosts } = useContext(ModalContext);

  const [mutedStates, setMutedStates] = useState({});

  const openModal = () => {
    showLoading();
  };

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    const newStates = {};
    post.forEach((pItem, pIndex) => {
      pItem?.videos?.forEach((_, vIndex) => {
        const key = `${pIndex}-${vIndex}`;
        newStates[key] = true; // Boshida hammasi muted
      });
    });
    setMutedStates(newStates);
  }, [post]);

  const handleMute = (postIndex, videoIndex) => {
    const clickedKey = `${postIndex}-${videoIndex}`;
    const updatedStates = {};

    Object.keys(mutedStates).forEach((key) => {
      updatedStates[key] = key === clickedKey ? !mutedStates[key] : true;
    });

    setMutedStates(updatedStates);
  };

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

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h3 className="title">Для вас</h3>
      </div>
      <div className="dashboard__main">
        <div className="dashboard__publish">
          <img
            width={45}
            height={45}
            style={{ borderRadius: "24px", cursor: "pointer" }}
            src="/dost.jpg"
            alt="profile-img"
          />
          <p className="dashboard__p" onClick={openModal}>
            Что нового?
          </p>
          <button className="dashboard__btn" onClick={openModal}>
            Опубликовать
          </button>
        </div>
        <span className="publish__line"></span>

        {post?.map((item, postIndex) => (
          <div className="posts-list" key={postIndex}>
            <div className="posts__list-wrap">
              <div className="posts__list-item">
                <div className="img__wrap">
                  <img
                    width={40}
                    height={40}
                    style={{ borderRadius: "24px" }}
                    src="/dost.jpg"
                    alt="img"
                  />
                </div>
                <div className="content__wrap">
                  <div className="header__wrapper">
                    <p className="user__name">bobur_qalandar0v</p>
                    <button className="dots__menu">
                      <span>
                        <DotsIcon />
                      </span>
                    </button>
                  </div>
                  {item?.text && <p className="post__text">{item.text}</p>}

                  {(item?.videos?.length > 0 || item?.images?.length > 0) && (
                    <div className="media__wrap">
                      {item?.videos?.map((i, videoIndex) => {
                        if (!i?.url) return null;
                        const key = `${postIndex}-${videoIndex}`;
                        const refIndex = postIndex * 1000 + videoIndex;

                        return (
                          <div
                            key={i.id || videoIndex}
                            className="video__wrap"
                            style={{
                              width:
                                item?.videos?.length === 1 ? "350px" : "260px",
                              height:
                                item?.videos?.length === 1 ? "430px" : "320px",
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

                      {item?.images?.map((i) =>
                        !i?.url ? null : (
                          <div
                            key={i.id}
                            className="image__wrap"
                            style={{
                              width: "300px",
                              height: "350px",
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
                          <button className="actions__icon">
                            <HeartActionIcon />
                            <span
                              style={{
                                color: "#fff",
                                fontSize: "17px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {i.likeCount === "0" ? "" : i.likeCount}
                            </span>
                          </button>
                        </div>
                        <div className="comment__action">
                          <button className="actions__icon">
                            <CommentIcon />
                            <span style={{ fontSize: "17px" }}>
                              {i.comentCount === "0" ? "" : i.comentCount}
                            </span>
                          </button>
                        </div>
                        <div className="share__action">
                          <button className="actions__icon">
                            <ShareIcon />
                            <span style={{ fontSize: "17px" }}>
                              {i.shareCount === "0" ? "" : i.shareCount}
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
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
