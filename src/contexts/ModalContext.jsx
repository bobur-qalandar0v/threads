import { createContext, useEffect, useRef, useState } from "react";
import { Backend } from "../api";
import { backendurls, urls } from "../constants/urls";
import { message } from "antd";

export const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const openMenuRef = useRef(null);
  const mainRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    postUid: null,
  });
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [followModal, setFollowModal] = useState(false);
  const [follow, setFollow] = useState(null);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [post, setPost] = useState([]);
  const [muted, setMuted] = useState(true);

  const getPosts = () => {
    setLoading(true);
    Backend.get(backendurls.user_post.get)
      .then((res) => {
        setPost(res.data);
        setMuted(res.data.map(() => true));
      })
      .catch((err) => {
        message.error("Xatolik");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getHandleLike = (updatePostId, updatedLikesCount) => {
    setPost((prevPosts) =>
      prevPosts.map((post) =>
        post.uid === updatePostId
          ? { ...post, likes_count: updatedLikesCount }
          : post
      )
    );
  };

  const showDeleteModal = (uid) => {
    setDeleteModal({ isOpen: true, uid });
  };

  const showLoading = () => {
    setOpenModal(true);
  };

  const showEditModal = () => {
    setEditModal(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 0);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        loading,
        post,
        muted,
        editModal,
        deleteModal,
        mainRef,
        openMenuRef,
        openMenu,
        openWarning,
        followModal,
        follow,
        following,
        followers,
        setFollowing,
        setFollowers,
        setFollow,
        getPosts,
        setPost,
        setMuted,
        setEditModal,
        setFollowModal,
        showEditModal,
        setOpenMenu,
        setOpenModal,
        handleCancel,
        getHandleLike,
        setDeleteModal,
        setOpenWarning,
        showLoading,
        showDeleteModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
