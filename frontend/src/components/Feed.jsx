import React from "react";
import Posts from "./Posts";
import { useSelector } from "react-redux";

const Feed = () => {
  const { posts } = useSelector((store) => store.post);

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="my-15 flex flex-col items-center pl-[2%]">
      <Posts posts={sortedPosts} />
    </div>
  );
};

export default Feed;
