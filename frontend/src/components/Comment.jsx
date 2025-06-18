import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const Comment = ({ comment }) => {
  if (!comment?.author) return null; // safety check

  return (
    <div className="flex gap-3 items-start mb-5">
      <Link to={`/profile/${comment.author._id}`} className="flex gap-3">
        <Avatar>
          <AvatarImage
            src={comment.author.profilePicture}
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-300 dark:text-black">
            U
          </AvatarFallback>
        </Avatar>
      </Link>
      <div>
        <h1 className="font-bold text-sm">
          <Link to={`/profile/${comment.author._id}`}>
            {comment.author.username}
          </Link>
          <span className="font-normal pl-1">{comment.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default Comment;
