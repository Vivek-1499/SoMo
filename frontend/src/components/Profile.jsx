import React from "react";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Profile = () => {
  const { id: userId } = useParams();
  useGetUserProfile(userId);

  const { userProfile } = useSelector((store) => store.auth);

  const getInitials = (name) => {
    if (!name) return "U";
    const [first, second] = name.split(" ");
    return (first?.[0] || "") + (second?.[0] || "");
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div className="relative w-full h-40 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900" />

      <div className="mt-[-70px] px-6 flex flex-col items-center sm:items-start sm:pl-[280px]">
        <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white dark:border-gray-900">
          <AvatarImage
            src={userProfile?.profilePicture}
            alt="User avatar"
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
            {getInitials(userProfile?.fullName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex gap-6 mt-3 text-center">
          <div>
            <p className="font-bold text-lg">
              {userProfile?.followers?.length || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Followers
            </p>
          </div>
          <div>
            <p className="font-bold text-lg">
              {userProfile?.followings?.length || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Followings
            </p>
          </div>
        </div>
      </div>

      {/* Name + Bio */}
      <div className="mt-4 px-6 text-center">
        <h2 className="text-xl font-semibold flex justify-center items-center gap-2">
          {userProfile?.username || "Unnamed User"}
          {userProfile?.isVerified && (
            <span className="bg-blue-500 text-white px-1.5 py-0.5 text-xs rounded-full">
              ✔
            </span>
          )}
        </h2>
        {userProfile?.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {userProfile.bio}
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
