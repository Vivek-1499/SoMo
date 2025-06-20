import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import useGetAllPost from "@/hooks/useGetAllPosts";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <>
      <div className="bg-purple-50 text-black dark:bg-gray-950 dark:text-white">
        <div className="flex-grow">
          <Feed />
          <Outlet />
        </div>
        <RightSideBar />
      </div>
    </>
  );
};

export default Home;
