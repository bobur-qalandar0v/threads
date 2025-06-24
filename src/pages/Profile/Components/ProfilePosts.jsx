import React, { useContext } from "react";
import { ModalContext } from "../../../contexts/ModalContext";
import { AuthContext } from "../../../contexts/AuthContext";

function ProfilePosts() {
  const { showLoading } = useContext(ModalContext);
  const { userInfo } = useContext(AuthContext);

  const openModal = () => {
    showLoading();
  };

  return (
    <div className="posts">
      <div className="posts__publish">
        <img
          width={45}
          height={45}
          style={{ borderRadius: "24px", cursor: "pointer" }}
          src={
            userInfo?.profile_img === "" || userInfo?.profile_img === undefined
              ? userInfo?.profile_default_img
              : userInfo?.profile_img
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
    </div>
  );
}

export default ProfilePosts;
