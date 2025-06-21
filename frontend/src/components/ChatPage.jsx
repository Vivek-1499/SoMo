import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { MessageCircleCode } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const dispatch = useDispatch();
  const { onlineUsers, messages } = useSelector((store) => store.chat);

  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v2/message/send/${receiverId}`,
        { message: textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);
  return (
<div className={`flex flex-col md:flex-row md:ml-20 lg:ml-64 h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300`}>
      {/* Sidebar */}
      <section className={`w-full md:w-[300px] p-3 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-700 ${
  selectedUser ? "hidden" : "block"
} md:block`}>

        <h1 className="font-bold mb-4 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300 dark:border-gray-700" />
        <div className="overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <Avatar>
                  <AvatarImage
                    className="object-cover"
                    src={suggestedUser?.profilePicture}
                  />
                  <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-400" : "text-red-400"
                    }`}>
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Window */}
      {selectedUser ? (
        
        <section className="flex-1 flex flex-col h-full">
          
          {/* Header */}
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-950 z-10">
            <Avatar>
              <AvatarImage
                className="object-cover"
                src={selectedUser?.profilePicture}
                alt="profile image"
              />
              <AvatarFallback className="bg-gray-300 dark:bg-gray-700">
                U
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-medium">{selectedUser?.username}</span>
            </div>
            <Button
  onClick={() => dispatch(setSelectedUser(null))}
  className="ml-auto md:hidden text-sm bg-gray-100 dark:bg-gray-800"
>
  Back
</Button>

          </div>
          <Messages selectedUser={selectedUser} />

          {/* Messages
          <div className="flex-1 p-4 overflow-y-auto">
            <p className="text-center text-gray-500 dark:text-gray-400">No messages yet</p>
          </div> */}

          {/* Message Input */}
          <div className="flex items-center p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent dark:bg-gray-800 dark:text-white"
              placeholder="Type your message..."
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              className="bg-purple-300 hover:bg-purple-400 dark:bg-purple-900 dark:hover:bg-purple-950 dark:text-white">
              Send
            </Button>
          </div>
        </section>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center flex-1 p-4 text-center">
          <MessageCircleCode className="w-20 h-20 md:w-32 md:h-32 my-4 text-gray-400 dark:text-gray-600" />
          <h1 className="font-medium text-xl">Your messages</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Send a message to start a chat
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
