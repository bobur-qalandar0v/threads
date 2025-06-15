import { createContext, useContext, useState } from "react";
import { API } from "../api";
import { urls } from "../constants/urls";
import { ModalContext } from "./ModalContext";

export const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  let localeInitial = localStorage.getItem("favorite")
    ? JSON.parse(localStorage.getItem("favorite"))
    : [];

  const [favorite, setFavorite] = useState(localeInitial);
  const { getPosts } = useContext(ModalContext);

  function setLocalFavorite(data) {
    localStorage.setItem("favorite", JSON.stringify(data));
    setFavorite(data);
  }

  function addFavorites(data) {
    const isLiked = favorite.some((item) => item.id === data.id);

    const updatedActions = {
      ...data.actions[0],
      likeCount: isLiked
        ? Math.max(0, data.actions[0].likeCount - 1)
        : data.actions[0].likeCount + 1,
    };

    if (isLiked) {
      setLocalFavorite(favorite.filter((item) => item.id !== data.id));
    } else {
      setLocalFavorite([...favorite, data]);
    }

    API.patch(`${urls.user_post.patch}/${data.id}`, {
      actions: [updatedActions],
    }).then(() => {
      getPosts();
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
