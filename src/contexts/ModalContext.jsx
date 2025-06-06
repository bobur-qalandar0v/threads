import { createContext, useState } from "react";

export const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <ModalContext.Provider
      value={{ showLoading, handleCancel, openModal, setOpenModal, loading }}
    >
      {children}
    </ModalContext.Provider>
  );
};
