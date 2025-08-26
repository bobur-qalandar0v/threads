import { createContext, useContext, useState } from "react";
import { Backend } from "../api";
import { backendurls, urls } from "../constants/urls";
import { ModalContext } from "./ModalContext";
import { AuthContext } from "./AuthContext";

export const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  let localeInitial = localStorage.getItem("favorite")
    ? JSON.parse(localStorage.getItem("favorite"))
    : [];

  const [favorite, setFavorite] = useState(localeInitial);
  const { setPost } = useContext(ModalContext);

  const { accessToken, setMyPosts } = useContext(AuthContext);

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
      `posts/${updatedData.uid}/like`,
      {
        likes_count: updatedData.likes_count,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((res) => {
        if (res.status === 201 || res.status === 204) {
          setPost((prevPosts) =>
            prevPosts.map((post) =>
              post.uid === updatedData.uid
                ? { ...post, likes_count: updatedData.likes_count }
                : post
            )
          );
          setMyPosts((prevPosts) =>
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
        console.log(err);
      });
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
