import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import { setChatPreviews, setMessages } from "@/redux/chatSlice";
import { api } from "./utils/api";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    const markSeenAndRefresh = async () => {
      try {
        await api.put(`/message/seen/${selectedUser._id}`);

        const res = await api.get("/message/previews");
        if (res.data.success) {
          dispatch(setChatPreviews(res.data.previews));
        }
      } catch (e) {
        console.log("Failed to mark messages as seen", e);
      }
    };

    if (selectedUser?._id) {
      markSeenAndRefresh();
    }
  }, [selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) return;

      const url = selectedUser.isGroup
        ? `/message/group/${selectedUser._id}`
        : `/message/${selectedUser._id}`;

      try {
        const res = await api.get(url);
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [selectedUser?._id, selectedUser?.isGroup]);

  return (
    <div ref={scrollContainerRef} className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="mt-6 flex flex-col items-center justify-center">
          <Avatar className="h-28 w-28 mb-2">
            <AvatarImage
              className="object-cover"
              src={selectedUser?.profilePicture || "/group-avatar.png"}
              alt="profile image"
            />
            <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
              {selectedUser?.isGroup ? selectedUser?.name?.[0] : "U"}
            </AvatarFallback>
          </Avatar>

          <span className="text-lg font-bold">
            {selectedUser?.isGroup ? selectedUser.name : selectedUser?.username}
          </span>

          {selectedUser?.isGroup ? (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Group Chat
            </span>
          ) : (
            <Link to={`/profile/${selectedUser?._id}`}>
              <Button className="text-xs">View Profile</Button>
            </Link>
          )}
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
