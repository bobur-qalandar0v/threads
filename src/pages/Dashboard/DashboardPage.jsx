import React, { useEffect, useState } from "react";
import { API } from "../../api";
import { urls } from "../../constants/urls";

function DashboardPage() {
  const [post, setPost] = useState([]);

  const getPosts = () => {
    API.get(urls.user_post.get).then((res) => setPost(res.data));
  };

  console.log(post.map((item) => item.images.url));

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h3 className="title">Для вас</h3>
      </div>
      <div className="dashboard__main">
        <div className="dashboard__publish">
          {post.map((item) => (
            // <p>{item.text}</p>
            <img
              width={100}
              height={100}
              key={item.id}
              src={item?.images?.url}
              alt="img"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
