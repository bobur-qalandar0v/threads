import { createContext, useEffect, useState } from "react";
import { API } from "../api";
import { urls } from "../constants/urls";

export const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [post, setPost] = useState([]);
  const [muted, setMuted] = useState(true);

  const getPosts = () => {
    API.get(urls.user_post.get).then((res) => {
      setPost(res.data);
      setMuted(res.data.map(() => true));
    });
  };

  const showLoading = () => {
    setOpenModal(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 400);
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
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
