import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v2/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/auth");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home", showOnMobile: true },
    { icon: <Search />, text: "Search", showOnMobile: true },
    { icon: <TrendingUp />, text: "Explore", showOnMobile: false },
    { icon: <MessageCircle />, text: "Messages", showOnMobile: false },
    { icon: <Heart />, text: "Notifications", showOnMobile: true },
    { icon: <PlusSquare />, text: "Create", showOnMobile: true },
    {
      icon: (
        <Avatar className="h-6 w-6">
          <AvatarImage src={user?.profilePicture} className="object-cover" />
          <AvatarFallback className="bg-gray-200 ">U</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
      showOnMobile: true,
    },
    { icon: <LogOut />, text: "Logout", showOnMobile: false },
  ];
  return (
    <>
      {/* Sidebar on tablet and desktop */}
      <nav
        className="hidden md:flex fixed top-0 left-0 h-full w-20 md:w-64
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-700
          flex-col items-center md:items-start
          py-6 px-2
          overflow-y-auto z-20">
        <h1 className="text-xl font-bold mb-8 px-4 hidden md:block">LOGO</h1>
        {sidebarItems.map((item, index) => (
          <button
            onClick={() => sidebarHandler(item.text)}
            key={index}
            className="flex items-center space-x-3 w-full py-4 px-4 rounded-lg
              text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
              transition-colors duration-200">
            <h1 className="w-6 h-6">{item.icon}</h1>
            <span className="hidden md:inline text-sm font-medium">
              {item.text}
            </span>
          </button>
        ))}
        <CreatePost open={open} setOpen={setOpen} />
      </nav>

      {/* phones */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full h-14
          bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700
          flex justify-around items-center z-20">
        {sidebarItems
          .filter((item) => item.showOnMobile)
          .map((item, index) => (
            <button
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
              <div className="w-15 h-15">{item.icon}</div>
            </button>
          ))}
        <CreatePost open={open} setOpen={setOpen} />
      </nav>
    </>
  );
};

export default LeftSideBar;
