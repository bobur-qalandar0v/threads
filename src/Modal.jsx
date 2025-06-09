import React, { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "./contexts/ModalContext";
import DraftIcon from "./assets/icons/DraftIcon";
import ModalMoreIcon from "./assets/icons/ModalMoreIcon";
import ImgIcon from "./assets/icons/ImgIcon";
import Xicon from "./assets/icons/Xicon";
import { API } from "./api";
import { urls } from "./constants/urls";
import { message } from "antd";

function ModalComponent() {
  const { openModal, handleCancel, loading } = useContext(ModalContext);
  const [value, setValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // Fayllar ro‘yxati

  const textareaRef = useRef(null);

  const isPublishDisabled = value.trim() === "" && selectedFiles.length === 0;

  // const handlePublish = async () => {
  //   if (isPublishDisabled) {
  //     return;
  //   }

  //   try {
  //     // Avval selectedFiles dan haqiqiy URL olish:
  //     const uploadedImages = [];
  //     const uploadedVideos = [];

  //     for (const file of selectedFiles) {
  //       const formData = new FormData();
  //       formData.append("file", file.file); // original file

  //       const res = await API.post(urls.user_post.post, formData);

  //       const uploadedUrl = res.data.url; // serverdan kelgan haqiqiy URL

  //       if (file.type === "image") {
  //         uploadedImages.push({ url: uploadedUrl });
  //       } else if (file.type === "video") {
  //         uploadedVideos.push({ url: uploadedUrl });
  //       }
  //     }

  //     // Endi haqiqiy URL larni POST qilamiz
  //     const payload = {
  //       text: value,
  //       images: uploadedImages,
  //       videos: uploadedVideos,
  //       actions: [
  //         {
  //           likeCount: "0",
  //           comentCount: "0",
  //           shareCount: "0",
  //         },
  //       ],
  //     };

  //     await API.post(urls.user_post.post, payload).then((res) =>
  //       console.log(res)
  //     );

  //     handleCancel();
  //     setSelectedFiles([]); // Fayllarni tozalash
  //     setValue(""); // Textni tozalash
  //   } catch (error) {
  //     console.error("Post yuborishda xatolik:", error);
  //   }
  // };

  const handlePublish = async () => {
    try {
      const uploadedImages = [];
      const uploadedVideos = [];

      // Fayllarni yuklash
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("image", file.file);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=c6a8b7042c866880c1678234f084e3bb`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (data.success) {
          if (file.type === "image") {
            uploadedImages.push({ url: data.data.url });
          }
          // Agar video bo‘lsa o‘z videoni serverga yuklashingiz kerak (video endpoint)
        }
      }

      // Post payload
      const payload = {
        text: value,
        images: uploadedImages,
        videos: uploadedVideos, // agar video upload qilinsa
        actions: [
          {
            likeCount: "0",
            comentCount: "0",
            shareCount: "0",
          },
        ],
      };

      // Post yuborish
      await API.post(urls.user_post.post, payload);

      // UI tozalash
      handleCancel();
      setSelectedFiles([]);
      setValue("");
    } catch (error) {
      console.error("Post yuborishda xatolik:", error);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [value]);

  // 🔸 Fayl tanlanganda preview qilish
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));

    setSelectedFiles((prev) => [...prev, ...previews]);
  };

  // 🔹 Faylni o‘chirish
  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => {
      const updated = [...prev];

      // URLni xotiradan tozalash
      URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  };

  if (!openModal) return null;

  return (
    <div className="modal__overlay" onClick={handleCancel}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <div className="loader__wrap">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="modal__header">
              <button className="modal__close" onClick={handleCancel}>
                Отмена
              </button>
              <h3 className="modal__title">Новая ветка</h3>
              <div className="icons__wrap">
                <button>
                  <DraftIcon />
                </button>
                <button>
                  <ModalMoreIcon />
                </button>
              </div>
            </div>
            <div className="modal__line"></div>
            <div className="modal__main">
              <div className="userinfo">
                <img
                  width={50}
                  height={50}
                  src="/dost.jpg"
                  alt="user-img"
                  style={{ borderRadius: "24px", marginTop: "10px" }}
                />
                <div style={{ flex: 1 }}>
                  <p className="username">bobur_qalandar0v</p>
                  <textarea
                    className="textarea"
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Что нового?"
                  ></textarea>
                </div>
              </div>

              {/* 🔽 Rasmlar/videos preview qismi */}
              <div className="media__preview">
                {selectedFiles.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.type === "image" ? (
                      <div
                        className="media__item-img"
                        style={{
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={item.url}
                          alt="preview"
                          style={{
                            height: "300px",
                            width: "300px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            cursor: "grab",
                            userSelect: "none",
                            scrollSnapAlign: "start" /* optional */,
                          }}
                        />
                        <button
                          onClick={() => handleRemoveFile(index)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "rgba(0,0,0,0.6)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Xicon />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="media__item-video"
                        style={{
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        <video
                          src={item.url}
                          autoPlay
                          loop
                          muted
                          style={{
                            objectFit: "cover",
                            width: "250px",
                            height: `${
                              selectedFiles.length === 1 &&
                              selectedFiles[0].type === "video"
                                ? "380px"
                                : "300px"
                            }`,
                            borderRadius: "8px",
                            cursor: "grab",
                            userSelect: "none",
                            scrollSnapAlign: "start" /* optional */,
                          }}
                        />
                        <button
                          onClick={() => handleRemoveFile(index)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "rgba(0,0,0,0.6)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Xicon />
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Fayl tanlash inputi */}
              <div className="input__file">
                {selectedFiles.length == 0 ? (
                  <label
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      gap: "6px",
                      marginTop: "5px",
                    }}
                  >
                    <ImgIcon />
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <span style={{ color: "rgb(119, 119, 119" }}>
                      Добавляйте фото и видео
                    </span>
                  </label>
                ) : (
                  <div>
                    <label
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        gap: "6px",
                        marginTop: "10px",
                      }}
                    >
                      <ImgIcon />
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                      <span style={{ color: "rgb(119,119,119" }}>Добавить</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="modal__footer">
              <div className="footer__wrap">
                <div className="footer__left" style={{ cursor: "pointer" }}>
                  <span>Кто угодно может отвечать и цитировать</span>
                </div>
                <div className="footer__right">
                  <button
                    className={`post__btn ${
                      isPublishDisabled ? "disabled" : ""
                    }`}
                    onClick={handlePublish}
                    disabled={isPublishDisabled}
                  >
                    Опубликовать
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ModalComponent;
