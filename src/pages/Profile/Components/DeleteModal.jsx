import React, { useContext, useState } from "react";
import { ModalContext } from "../../../contexts/ModalContext";
import { Backend } from "../../../api";
import { AuthContext } from "../../../contexts/AuthContext";
import { message } from "antd";

function DeleteModal() {
  const { deleteModal, setDeleteModal } = useContext(ModalContext);
  const { getMyProfile } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  if (deleteModal?.isOpen === false) {
    return null;
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, postUid: null });
  };

  const handlePostDelete = () => {
    setLoading(true);
    Backend.delete(`/posts/${deleteModal.uid}`)
      .then((res) => {
        if (res.status == 204) {
          setDeleteModal({ isOpen: false, postUid: null });
          message.success("Post o'chirildi");
          getMyProfile();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="deleteModal">
      <div className="deleteModal__wrap">
        <div className="deleteModal__content">
          <h3>Удалить публикацию?</h3>
          <p>
            Если вы удалите эту публикацию, восстановить ее будет невозможно.
          </p>
        </div>
        <div className="btns__wrap">
          <button className="cancel" onClick={() => handleDeleteCancel()}>
            <span>Отмена</span>
          </button>
          <button className="delete" onClick={() => handlePostDelete()}>
            {loading ? <div className="loader"></div> : <span>Удалить</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
