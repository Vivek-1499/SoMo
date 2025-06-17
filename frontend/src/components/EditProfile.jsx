import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);

  const getInitials = (name) => {
    if (!name) return "U";
    const [first, second] = name.split(" ");
    return (first?.[0] || "") + (second?.[0] || "");
  };
  return (
    <div>
      <section>
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white dark:border-gray-900">
              <AvatarImage
                src={user?.profilePicture}
                alt="User avatar"
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                {getInitials(user?.fullName)}
              </AvatarFallback>
            </Avatar>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
