import React, { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "../../contexts/ModalContext";
import VolumeMutedIcon from "../../assets/icons/VolumeMutedIcon";
import VolumeIcon from "../../assets/icons/VolumeIcon";
import HeartActionIcon from "../../assets/icons/HeartActionIcon";
import CommentIcon from "../../assets/icons/CommentIcon";
import ShareIcon from "../../assets/icons/ShareIcon";
import DotsIcon from "../../assets/icons/DotsIcon";

function DashboardPage() {
  const videoRef = useRef(null);

  const [videoRefs, setVideoRefs] = useState([]);
  const [mutedVideos, setMutedVideos] = useState([]);

  const { showLoading, post, getPosts } = useContext(ModalContext);

  const handleMute = (postIndex, videoIndex) => {
    setMutedVideos((prev) =>
      prev.map((postMuted, i) =>
        i === postIndex
          ? postMuted.map((m, j) => (j === videoIndex ? !m : m))
          : postMuted
      )
    );
  };

  const openModal = () => {
    showLoading();
  };

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    // Har bir post uchun videoRefs va mutedVideos ni yangilash
    const refs = post.map((item) =>
      (item.videos || []).map(() => React.createRef())
    );
    const muted = post.map((item) => (item.videos || []).map(() => true));

    setVideoRefs(refs);
    setMutedVideos(muted);
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
        {post?.map((item, index) => (
          <div className="posts-list">
            <div className="posts__list-wrap">
              <div className="posts__list-item" key={item.id}>
                <div className="img__wrap">
                  <img
                    width={45}
                    height={45}
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
                  <p className="post__text">{item?.text}</p>

                  {item?.videos?.length > 0 || item?.images?.length > 0 ? (
                    <div className="media__wrap">
                      {/* VIDEO */}
                      {item?.videos?.map((i, videoIndex) => {
                        if (i?.url == "") {
                          return <></>;
                        } else {
                          return (
                            <div
                              key={i.id || videoIndex}
                              className="video__wrap"
                              style={{
                                width: "280px",
                                height: "350px",
                                position: "relative",
                                flexShrink: 0,
                              }}
                            >
                              <video
                                ref={videoRefs[index]?.[videoIndex]}
                                src={i?.url}
                                autoPlay
                                loop
                                muted={mutedVideos[index]?.[videoIndex]}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                              <button
                                className="volume__muted-btn"
                                onClick={() => handleMute(index, videoIndex)}
                              >
                                {mutedVideos[index]?.[videoIndex] ? (
                                  <VolumeMutedIcon />
                                ) : (
                                  <VolumeIcon />
                                )}
                              </button>
                            </div>
                          );
                        }
                      })}

                      {/* IMAGE */}
                      {item?.images?.map((i) => {
                        if (i?.url == "") {
                          return <></>;
                        } else {
                          return (
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
                                src={i?.url}
                                alt="ovqat"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            </div>
                          );
                        }
                      })}
                    </div>
                  ) : (
                    <></>
                  )}

                  {/* ACTIONS */}
                  {item?.actions?.map((i) => (
                    <div className="actions">
                      <div className="actions__wrap">
                        <div className="heart__action">
                          <button className="actions__icon">
                            <HeartActionIcon />
                            <span
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "17px",
                              }}
                            >
                              {i.likeCount == "0" ? "" : i.likeCount}
                            </span>
                          </button>
                        </div>
                        <div className="comment__action">
                          <button className="actions__icon">
                            <CommentIcon />
                            <span style={{ fontSize: "17px" }}>
                              {i.comentCount == "0" ? "" : i.comentCount}
                            </span>
                          </button>
                        </div>
                        <div className="share__action">
                          <button className="actions__icon">
                            <ShareIcon />
                            <span style={{ fontSize: "17px" }}>
                              {i.shareCount == "0" ? "" : i.shareCount}
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
