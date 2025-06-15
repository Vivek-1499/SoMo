import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  if (!Array.isArray(suggestedUsers) || suggestedUsers.length === 0)
    return null;

  return (
    <div className="my-3 space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Suggested for you
        </h2>
        <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer dark:text-blue-400 dark:hover:text-blue-200 transition">
          See All
        </span>
      </div>

      <div className="space-y-2">
        {suggestedUsers.slice(0, 3).map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Link to={`/profile/${user._id}`} className="flex items-center gap-3 group">
              <Avatar className="bg-slate-200 w-8 h-8">
                <AvatarImage src={user?.profilePicture} className="object-cover" />
                <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:underline">
                  {user?.username || "Unknown"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
                  {user?.bio || "No bio available"}
                </span>
              </div>
            </Link>

            <button
              className="text-xs font-medium px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
              onClick={(e) => {
                e.preventDefault();
                // Trigger follow action here
                console.log(`Follow ${user.username}`);
              }}
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
