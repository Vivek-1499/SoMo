import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import useGetAllPost from "@/hooks/useGetAllPosts";

const Home = () => {
  useGetAllPost()
  return (
    <>
    <div className="bg-white text-black dark:bg-gray-950 dark:text-white">

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
