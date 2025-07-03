export const urls = {
  auth: {
    login: "/auth",
    user: "/users",
  },
  user_post: {
    post: "/user_posts",
    patch: "/user_posts",
    get: "/user_posts",
  },
  my_posts: {
    get: "/my_posts",
    post: "/my_posts",
    patch: "/my_posts",
  },
};

export const backendurls = {
  auth: {
    login: "/login",
    register: "/register",
    logout: "/logout",
  },

  user_post: {
    post: "/posts/add",
    get: "/posts/recommended",
  },
};

export const baseURL = {
  url: "https://threadsapi-vd30.onrender.com",
};
