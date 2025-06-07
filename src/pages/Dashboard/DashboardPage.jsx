import React, { useContext, useEffect, useRef, useState } from "react";
import { API } from "../../api";
import { urls } from "../../constants/urls";
import { ModalContext } from "../../contexts/ModalContext";
import VolumeMutedIcon from "../../assets/icons/VolumeMutedIcon";
import VolumeIcon from "../../assets/icons/VolumeIcon";
import HeartActionIcon from "../../assets/icons/HeartActionIcon";
import CommentIcon from "../../assets/icons/CommentIcon";
import ShareIcon from "../../assets/icons/ShareIcon";
import { Swiper, SwiperSlide } from "swiper/react";
import DotsIcon from "../../assets/icons/DotsIcon";

function DashboardPage() {
  const videoRef = useRef(null);

  const [post, setPost] = useState([]);
  const [muted, setMuted] = useState(true);

  const { showLoading } = useContext(ModalContext);

  const getPosts = () => {
    API.get(urls.user_post.get).then((res) => setPost(res.data));
  };

  console.log(post.map((item) => item.videos.url));

  const handleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const openModal = () => {
    showLoading();
  };

  useEffect(() => {
    getPosts();
  }, []);

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
        <div className="posts-list">
          <div className="posts__list-wrap">
            <div className="posts__list-item">
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
                <p className="post__text">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Possimus delectus expedita et cupiditate voluptatum mollitia
                  neque eaque quibusdam dignissimos dolorem?
                </p>

                <div className="media__wrap">
                  <div
                    className="video__wrap"
                    style={{
                      width: "250px",
                      height: "330px",
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    <video
                      ref={videoRef}
                      src="/motiv.mp4"
                      autoPlay
                      loop
                      muted={muted}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <button className="volume__muted-btn" onClick={handleMute}>
                      {muted ? <VolumeMutedIcon /> : <VolumeIcon />}
                    </button>
                  </div>
                  <div
                    className="image__wrap"
                    style={{
                      width: "340px",
                      height: "330px",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src="/ovqat.jpeg"
                      alt="ovqat"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                </div>

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
                          10
                        </span>
                      </button>
                    </div>
                    <div className="comment__action">
                      <button className="actions__icon">
                        <CommentIcon />
                        <span style={{ fontSize: "17px" }}>10</span>
                      </button>
                    </div>
                    <div className="share__action">
                      <button className="actions__icon">
                        <ShareIcon />
                        <span style={{ fontSize: "17px" }}>9</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
