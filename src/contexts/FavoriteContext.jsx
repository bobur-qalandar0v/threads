import { createContext, useContext, useState } from "react";
import { Backend } from "../api";
import { backendurls, urls } from "../constants/urls";
import { ModalContext } from "./ModalContext";
import { message } from "antd";
import { AuthContext } from "./AuthContext";

export const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  let localeInitial = localStorage.getItem("favorite")
    ? JSON.parse(localStorage.getItem("favorite"))
    : [];

  const [favorite, setFavorite] = useState(localeInitial);
  const { getPosts, setPost, getMyPosts, getHandleLike } =
    useContext(ModalContext);

  const { access_token } = useContext(AuthContext);

  function setLocalFavorite(data) {
    localStorage.setItem("favorite", JSON.stringify(data));
    setFavorite(data);
  }

  function addFavorites(updatedData, isLiked) {
    // LocalStorage favoritni yangilash
    if (isLiked) {
      setLocalFavorite(favorite.filter((item) => item.uid !== updatedData.uid));
    } else {
      setLocalFavorite([...favorite, updatedData]);
    }

    // Backend so‘rovi (faqat signal sifatida)
    Backend.post(
      `${backendurls.user_post.like}/${updatedData.uid}/like`,
      {
        likes_count: updatedData.likes_count,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((res) => {
        if (res.status === 201) {
          // Post ro‘yxatini yangilash
          setPost((prevPosts) =>
            prevPosts.map((post) =>
              post.uid === updatedData.uid
                ? { ...post, likes_count: updatedData.likes_count }
                : post
            )
          );
        }
      })
      .catch((err) => {
        console.error("Like request error:", err);
      });

    // PATCH SO'ROV
    // Backend.patch(`${backendurls.user_post.like}/${updatedData.uid}/like/`, {
    //   likes_count: updatedData.likes_count,
    // })
    //   .then((res) => {
    //     if (res.status === 200 || res.status === 201) {
    //       setPost((prevPosts) =>
    //         prevPosts.map((post) =>
    //           post.uid === updatedData.uid
    //             ? { ...post, likes_count: updatedData.likes_count }
    //             : post
    //         )
    //       );
    //     }
    //   })
    //   .catch((err) => {
    //     console.error("Like request error:", err);
    //     message.error("Layk bosilmadi");
    //   });
  }

  function deleteFavorite(id) {
    setLocalFavorite(favorite.filter((item) => item.id !== id));
  }

  return (
    <FavoriteContext.Provider
      value={{
        favorite,
        addFavorites,
        deleteFavorite,
        setLocalFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}
