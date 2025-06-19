import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Messages = ({ selectedUser }) => {
  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="mt-6 flex flex-col items-center justify-center">
          <Avatar className="h-28 w-28 mb-2">
            <AvatarImage
              className="object-cover"
              src={selectedUser?.profilePicture}
              alt="profile inage"
            />
            <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
              U
            </AvatarFallback>
          </Avatar>
          <span className="text-lg font-bold">{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="text-xs">View Profile</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">{
        [1,2,3,4].map((msg)=>{
          return(
            <div className={`flex`}>
              <div>
                {msg}
              </div>
            </div>
          )
        })
        }
      </div>
    </div>
  );
};

export default Messages;
