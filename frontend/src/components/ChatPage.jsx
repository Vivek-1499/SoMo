import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { MessageCircleCode } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Messages from "./Messages";
import { setChatPreviews, setMessages } from "@/redux/chatSlice";
import { formatDistanceToNow } from "date-fns";
import { api } from "./utils/api";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const dispatch = useDispatch();
  const {
    onlineUsers,
    messages,
    chatPreviews = [],
  } = useSelector((store) => store.chat);

  const sendMessageHandler = async () => {
    if (!textMessage.trim()) return;

    const isGroup = selectedUser?.isGroup;
    const endpoint = isGroup
      ? "/message/group/send"
      : `/message/send/${selectedUser._id}`;

    const payload = isGroup
      ? { message: textMessage, conversationId: selectedUser._id }
      : { message: textMessage };

    try {
      const res = await api.post(endpoint, payload);

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.error("Message send error:", error);
    }
  };

  useEffect(() => {
    const markMessagesAsSeen = async () => {
      if (!selectedUser?._id) return;
      try {
        await api.put(`/message/seen/${selectedUser._id}`, {});
        const res = await api.get("/message/previews");
        if (res.data.success) {
          dispatch(setChatPreviews(res.data.previews));
        }
      } catch (err) {
        console.error("Error marking messages as seen:", err);
      }
    };

    if (selectedUser?._id) {
      markMessagesAsSeen();
    }
  }, [selectedUser?._id, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  useEffect(() => {
    const fetchPreviews = async () => {
      try {
        const res = await api.get("/message/previews");

        if (res.data.success) {
          dispatch(setChatPreviews(res.data.previews));
        }
      } catch (err) {
        console.error("Preview fetch error:", err);
      }
    };

    fetchPreviews();
  }, []);

  return (
    <div
      className={`flex flex-col md:flex-row md:ml-20 lg:ml-64 h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300`}>
      {/* Sidebar */}

      <section
        className={`w-full md:w-[300px] p-3 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-700 ${
          selectedUser ? "hidden" : "block"
        } md:block`}>
        <h1 className="font-bold mb-4 text-xl">{user?.username}</h1>
        <Button
          onClick={() => setShowGroupModal(true)}
          className="w-full mb-3 bg-purple-500 hover:bg-purple-600 text-white">
          + Create Group
        </Button>
        <hr className="mb-4 border-gray-300 dark:border-gray-700" />
        <div className="overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
          {Array.isArray(chatPreviews) &&
            chatPreviews.map(({ user: suggestedUser, group, lastMessage }) => {
              const isGroup = !!group;
              const displayName = isGroup ? group.name : suggestedUser.username;
              const displayPicture = isGroup
                ? group.profilePicture || "/group-avatar.png"
                : suggestedUser?.profilePicture;
              const displayId = isGroup ? group._id : suggestedUser._id;
              const isOnline =
                !isGroup && onlineUsers.includes(suggestedUser._id);
              const isUnread =
                lastMessage?.senderId !== user._id &&
                lastMessage?.status === "unread";

              return (
                <div
                  key={displayId}
                  onClick={() =>
                    dispatch(
                      setSelectedUser(
                        isGroup ? { ...group, isGroup: true } : suggestedUser
                      )
                    )
                  }
                  className={`flex gap-3 items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                    isUnread ? "bg-purple-50 dark:bg-purple-950" : ""
                  }`}>
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        className="object-cover"
                        src={displayPicture}
                      />
                      <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                        {displayName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {!isGroup && (
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                          isOnline ? "bg-green-500" : "bg-red-500"
                        } border-2 border-white dark:border-gray-900`}></span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium">{displayName}</span>
                    <span className="text-xs truncate text-gray-500 dark:text-gray-400">
                      {lastMessage?.message || "No messages yet"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] italic text-gray-400">
                        {lastMessage?.senderId === user._id
                          ? lastMessage?.seenBy?.includes(user._id)
                            ? "✓✓ Seen"
                            : "✓ Sent"
                          : isUnread
                          ? "Unread"
                          : ""}
                      </span>
                      {isUnread && lastMessage?.unreadCount > 0 && (
                        <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full">
                          {lastMessage.unreadCount > 9
                            ? "9+"
                            : lastMessage.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  {lastMessage?.createdAt && (
                    <span className="text-[10px] text-gray-400 ml-auto">
                      {formatDistanceToNow(new Date(lastMessage.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </section>
      {showGroupModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold">Create Group Chat</h2>
            <Input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="dark:bg-gray-800"
            />
            <div className="max-h-48 overflow-y-auto space-y-2">
              {suggestedUsers.map((u) => (
                <label
                  key={u._id}
                  className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-purple-600"
                    checked={selectedMembers.includes(u._id)}
                    onChange={(e) => {
                      setSelectedMembers((prev) =>
                        e.target.checked
                          ? [...prev, u._id]
                          : prev.filter((id) => id !== u._id)
                      );
                    }}
                  />
                  <span>{u.username}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowGroupModal(false)}>
                Cancel
              </Button>
              <Button
                disabled={!groupName.trim() || selectedMembers.length === 0}
                onClick={async () => {
                  try {
                    const res = await api.post("/message/group/create", {
                      name: groupName,
                      participantIds: selectedMembers,
                    });
                    if (res.data.success) {
                      setShowGroupModal(false);
                      setGroupName("");
                      setSelectedMembers([]);
                      // Refresh previews
                      const refreshed = await api.get("/message/previews");
                      if (refreshed.data.success) {
                        dispatch(setChatPreviews(refreshed.data.previews));
                      }
                    }
                  } catch (err) {
                    console.error("Error creating group:", err);
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50">
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {selectedUser ? (
        <section className="flex-1 flex flex-col h-full">
          {/* Header */}
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-950 z-10">
            <Avatar>
              <AvatarImage
                className="object-cover"
                src={selectedUser?.profilePicture || "/group-avatar.png"}
                alt="profile image"
              />
              <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                {selectedUser?.isGroup ? selectedUser?.name?.[0] : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-lg font-bold">
                {selectedUser?.isGroup
                  ? selectedUser.name
                  : selectedUser?.username}
              </span>
            </div>
            <Button
              onClick={() => dispatch(setSelectedUser(null))}
              className="ml-auto md:hidden text-sm bg-gray-100 dark:bg-gray-800">
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
        <div className=" hidden flex flex-col items-center justify-center flex-1 p-4 text-center ">
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
