import React, { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "./contexts/ModalContext";
import { AuthContext } from "./contexts/AuthContext";

function FollowModal() {
  const followRef = useRef();

  const { followModal, following, followers, setFollowModal } =
    useContext(ModalContext);

  const { userProfile } = useContext(AuthContext);

  const [follower, setFollower] = useState(true);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (followRef.current && !followRef.current.contains(e.target)) {
        setFollowModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [follower]);

  if (!followModal) {
    return null;
  }
  return (
    <div className="follow-modal__overlay">
      <div className="follow-modal__wrap">
        <div className="follow-modal__content" ref={followRef}>
          <div className="follow-modal__header">
            <div
              className={`header__left ${follower ? "active" : ""}`}
              onClick={() => setFollower(true)}
            >
              <h3 className={`header__left-title ${follower ? "active" : ""}`}>
                Followers
              </h3>
              <p className={`header__left-count ${follower ? "active" : ""}`}>
                {followers?.followers?.length}
              </p>
            </div>
            <div
              className={`header__right ${!follower ? "active" : ""}`}
              onClick={() => setFollower(false)}
            >
              <h3
                className={`header__right-title ${!follower ? "active" : ""}`}
              >
                Following
              </h3>
              <p className={`header__right-count ${!follower ? "active" : ""}`}>
                {following?.following?.length}
              </p>
            </div>
          </div>
          {!follower ? (
            following?.following?.length === 0 ? (
              <div className="no-content">
                <p>{userProfile?.username} isn't following anyone yet.</p>
              </div>
            ) : (
              following?.following?.map((item) => (
                <div className="follow-modal__list">
                  <div className="left-img__wrap">
                    <img
                      src={
                        item?.photo === null
                          ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
                          : item?.photo
                      }
                      alt="img"
                      className="left__img"
                    />
                  </div>
                  <div className="list-wrap">
                    <div className="list-left">
                      <h4 className="followers-username">{item.username}</h4>
                      <p className="followers-fullname">{item.fullname}</p>
                    </div>
                    <div className="list-right">
                      <button className="follow-bnt">Following</button>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : followers?.followers?.length === 0 ? (
            <div className="no-content">
              <p>{userProfile?.username} isn't followers anyone yet.</p>
            </div>
          ) : (
            followers?.followers?.map((item) => (
              <div className="follow-modal__list">
                <div className="left-img__wrap">
                  <img
                    src={
                      item?.photo === null
                        ? "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
                        : item?.photo
                    }
                    alt="img"
                    className="left__img"
                  />
                </div>
                <div className="list-wrap">
                  <div className="list-left">
                    <h4 className="followers-username">{item.username}</h4>
                    <p className="followers-fullname">{item.fullname}</p>
                  </div>
                  <div className="list-right">
                    <button className="follow-bnt">Following</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowModal;
