import React, { useContext, useEffect, useRef } from "react";
import LogoIcon from "./assets/icons/LogoIcon";
import { ModalContext } from "./contexts/ModalContext";
import { useNavigate } from "react-router-dom";

function WarningModal() {
  const modalRef = useRef();
  const navigate = useNavigate();

  const { openWarning, setOpenWarning } = useContext(ModalContext);

  const handleNavigate = () => {
    navigate("/login");
    setOpenWarning(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenWarning(false);
      }
    };

    // Event listener qo'shamiz
    document.addEventListener("mousedown", handleClickOutside);

    // Tozalash
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenWarning]);

  if (!openWarning) {
    return null;
  }

  return (
    <div className="warning-modal">
      <div className="warning-modal__wrap" ref={modalRef}>
        <div className="warning-modal-logo">
          <div className="logo-wrap">
            <LogoIcon width={50} height={50} />
          </div>
        </div>
        <div className="warning-modal-content">
          <h1>Зарегистрируйтесь, чтобы размещать публикации</h1>
          <p>
            Присоединяйтесь к Threads, чтобы делиться идеями, задавать вопросы,
            записывать мысли и делать многое другое.
          </p>
        </div>
        <div className="warning-modal-btns">
          <button className="login-btn" onClick={() => handleNavigate()}>
            <span>Войти</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningModal;
