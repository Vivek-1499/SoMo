import React from "react";
import Post from "./Post";

const Posts = () => {
  return (
    <div className="items-center">
      {" "}
      {[1, 2, 3, 5].map((item, index) => (
        <Post key={index} />
      ))}
    </div>
  );
};

export default Posts;
