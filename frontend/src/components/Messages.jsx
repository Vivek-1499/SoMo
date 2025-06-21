import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  return (
    <div ref={scrollContainerRef} className="overflow-y-auto flex-1 p-4">
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
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => {
            return (
              <div
                key={msg._id}
                className={`flex ${
                  (msg.senderId._id || msg.senderId) === user?._id
                    ? "justify-end"
                    : "justify-start"
                }`}>
                <div
                  className={` p-2 rounded-lg max-w-xs break-words ${
                    (msg.senderId._id || msg.senderId) === user?._id
                      ? "bg-purple-100 dark:bg-purple-900"
                      : "bg-indigo-200 dark:bg-indigo-900"
                  }`}>
                  {typeof msg.message === "string"
                    ? msg.message
                    : msg.message?.message}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
