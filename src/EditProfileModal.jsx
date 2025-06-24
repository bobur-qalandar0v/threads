import React, { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "./contexts/ModalContext";
import { AuthContext } from "./contexts/AuthContext";
import { Button, Form, Input, message } from "antd";
import EmptyUserImg from "./assets/icons/EmptyUserImg";
import { API } from "./api";
import { urls } from "./constants/urls";

function EditProfileModal() {
  const [form] = Form.useForm();

  const menuRef = useRef(null);
  const profileMainRef = useRef(null);
  // const textareaRef = useRef(null);

  const { editModal, loading, setEditModal } = useContext(ModalContext);

  const { userInfo, setUserInfo, userId, getUserData } =
    useContext(AuthContext);

  useEffect(() => {
    if (userInfo?.profile_img) {
      setSelectedImage([
        {
          file: null,
          url: userInfo?.profile_img,
        },
      ]);
    }
  }, [userInfo]);

  // const [value, setValue] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const [changeImage, setChangeImage] = useState(false);

  const [selectedImage, setSelectedImage] = useState([
    { file: null, url: `${userInfo?.profile_img}` },
  ]);

  const handleSave = async (data) => {
    try {
      let profile_img_url = selectedImage[0]?.url;

      setIsPublishing(true);
      const formData = new FormData();

      if (selectedImage[0]?.file) {
        formData.append("file", selectedImage[0]?.file);
        formData.append("is_profile", "true");

        const res = await fetch("http://localhost:5000/upload-profile", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();

        if (result?.media_url) {
          profile_img_url = result?.media_url;
        } else {
          message.error("Rasm yuklashda xatolik");
          return;
        }
      }

      const payload = {
        name_and_surname: data?.name_and_surname,
        username: data?.username,
        profile_img: profile_img_url,
        user_bio: data?.user_bio,
        user_url: data?.user_url,
      };

      API.patch(`${urls.auth.user}/${userId}`, payload).then((res) => {
        if (res.status === 200) {
          setSelectedImage([
            {
              file: null,
              url: res.data?.profile_img,
            },
          ]);
          getUserData();
          setChangeImage(false);
          setEditModal(false);
          message.success("Saqlandi!");
        }
      });
    } catch (err) {
      console.error(err);
      message.error("Saqlashda xatolik yuz berdi!");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = () => {
    setSelectedImage([]);
    setChangeImage(false);
  };

  const handleClose = () => {
    getUserData();
    setChangeImage(false);
    setEditModal(false);
  };

  const onFinishField = () => {
    message.warning("Maydonlar bo'sh bo'lishi mumkin emas!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const preview = {
        file,
        url: URL.createObjectURL(file),
      };

      setSelectedImage([preview]);
    }
    setChangeImage(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileMainRef.current &&
        !profileMainRef.current.contains(e.target)
      ) {
        handleClose();
      }

      if (
        changeImage &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setChangeImage(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [changeImage]);

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length > 0) {
      form.setFieldsValue({
        name_and_surname: userInfo?.name_and_surname || "",
        username: userInfo?.username || "",
        user_bio: userInfo?.user_bio || "",
        user_url: userInfo?.user_url || "",
      });
    }
  }, [editModal, userInfo, form]);

  // useEffect(() => {
  //   const textarea = textareaRef.current;
  //   if (textarea) {
  //     textarea.style.height = "auto";
  //     textarea.style.height = textarea.scrollHeight + "px";
  //   }
  // }, [value]);

  if (!editModal) return null;

  return (
    <div className="custom-modal__overlay">
      <div className="custom-modal" ref={profileMainRef}>
        {loading ? (
          <div className="loader__wrap">
            <div className="loader"></div>
          </div>
        ) : (
          <Form
            form={form}
            onFinish={handleSave}
            onFinishFailed={onFinishField}
          >
            <div className="custom__wrapper">
              <div className="title__wrap">
                <h2>Редактировать профиль</h2>
              </div>
              <div className="custom__name">
                <div className="text__wrap">
                  <h3 className="title">Имя</h3>
                  <Form.Item
                    className="form-item"
                    name="name_and_surname"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      className="form-input"
                      type="text"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <p className="line"></p>
                </div>
                <div className="img__wrap">
                  {
                    selectedImage[0]?.url === "undefined" ||
                    selectedImage[0]?.url === "" ||
                    selectedImage.length === 0 ? (
                      <label style={{ cursor: "pointer" }}>
                        <div
                          style={{
                            width: "55px",
                            height: "55px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgb(30,30,30)",
                            borderRadius: "50%",
                          }}
                        >
                          <EmptyUserImg />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />
                      </label>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => setChangeImage(true)}
                        >
                          <img
                            style={{
                              width: "55px",
                              height: "55px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                            src={selectedImage[0]?.url}
                            alt="img"
                          />
                        </div>
                      </div>
                    )
                    // ) : selectedImage[0]?.url ? (
                    //   <div
                    //     style={{
                    //       display: "flex",
                    //       alignItems: "center",
                    //       justifyContent: "center",
                    //     }}
                    //   >
                    //     <div
                    //       style={{ cursor: "pointer" }}
                    //       onClick={() => setChangeImage(true)}
                    //     >
                    //       <img
                    //         style={{
                    //           width: "55px",
                    //           height: "55px",
                    //           borderRadius: "50%",
                    //           objectFit: "cover",
                    //         }}
                    //         src={selectedImage[0]?.url}
                    //         alt="img"
                    //       />
                    //     </div>
                    //   </div>
                    // ) : (
                    //   <div
                    //     style={{
                    //       display: "flex",
                    //       alignItems: "center",
                    //       justifyContent: "center",
                    //     }}
                    //   >
                    //     <div
                    //       style={{ cursor: "pointer" }}
                    //       onClick={() => setChangeImage(true)}
                    //     >
                    //       <img
                    //         style={{
                    //           width: "55px",
                    //           height: "55px",
                    //           borderRadius: "50%",
                    //           objectFit: "cover",
                    //         }}
                    //         src={userInfo?.profile_img}
                    //         alt="img"
                    //       />
                    //     </div>
                    //   </div>
                  }
                </div>
              </div>

              {changeImage ? (
                <div className="custom__content-wrap" ref={menuRef}>
                  <label className="upload__picture">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      key={selectedImage.length}
                    />
                    Загрузить изображение
                  </label>
                  <button onClick={handleDelete} className="delete__picture">
                    Удалить текущее фото
                  </button>
                </div>
              ) : null}

              <div className="custom__username">
                <h3 className="title">Имя пользователя</h3>
                <Form.Item
                  className="form-item"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Input
                    className="form-input"
                    type="text"
                    autoComplete="off"
                  />
                </Form.Item>
                <p className="line"></p>
              </div>
              <div className="custom__bio">
                <h3 className="title">Биография</h3>
                <Form.Item className="form-item" name="user_bio">
                  <Input
                    className="form-input"
                    type="text"
                    placeholder="Написать биографию"
                    autoComplete="off"
                    maxLength={75}
                  />
                </Form.Item>
                <p className="line"></p>
              </div>
              <div className="custom__link">
                <h3 className="title">Ссылки</h3>
                <Form.Item className="form-item" name="user_url">
                  <Input
                    className="form-input"
                    type="url"
                    placeholder="Добавить ссылку(URL)"
                    autoComplete="off"
                  />
                </Form.Item>
                <p className="line"></p>
              </div>
              <div className="custom__btn">
                <Form.Item className="form-item">
                  <Button
                    className={`ready__btn ${isPublishing ? "disabled" : ""}`}
                    htmlType="submit"
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <div className="loader__btn"></div>
                    ) : (
                      "Готово"
                    )}
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}

export default EditProfileModal;
