import { createContext, useEffect, useRef, useState } from "react";
import { API, Backend } from "../api";
import { backendurls, urls } from "../constants/urls";

export const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const openMenuRef = useRef(null);

  const mainRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const [post, setPost] = useState([]);

  const [muted, setMuted] = useState(true);

  const getPosts = () => {
    Backend.get(backendurls.user_post.get).then((res) => {
      setPost(res.data);
      setMuted(res.data.map(() => true));
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

  const showLoading = () => {
    setOpenModal(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 0);
  };

  const showEditModal = () => {
    setEditModal(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 300);
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
        showLoading,
        handleCancel,
        openModal,
        setOpenModal,
        loading,
        getPosts,
        setPost,
        post,
        muted,
        setMuted,
        editModal,
        setEditModal,
        showEditModal,
        openMenu,
        setOpenMenu,
        openMenuRef,
        mainRef,
        getHandleLike,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
