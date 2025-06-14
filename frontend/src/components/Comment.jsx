import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Comment = ({ comment }) => {
  return (
    <div className="flex gap-3 items-start mb-5">
      <Avatar>
        <AvatarImage src={comment?.author?.profilePicture} className='object-cover'/>
        <AvatarFallback className="bg-gray-300 dark:text-black">U</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="font-bold text-sm">
          {comment?.author?.username}
          <span className="font-normal pl-1">{comment?.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default Comment;
