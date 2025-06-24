import React, { useContext } from "react";
import { ModalContext } from "./contexts/ModalContext";

function InfoModal() {
  const { openInfoModal } = useContext(ModalContext);

  if (!openInfoModal) return null;

  return (
    <div className="openInfoModal__overlay">
      <div className="openInfoModal__content">
        <p>Soxranit</p>
        <p>qiziq emas</p>
        <p>bloklash</p>
        <p>jaloba qilish</p>
        <p>kopirovat</p>
      </div>
    </div>
  );
}

export default InfoModal;
