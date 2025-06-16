import {
  Heart,
  Home,
  Menu,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
import SuggestedUsers from "./SuggestedUsers";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showMoreDialog, setShowMoreDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setIsDarkMode(html.classList.contains("dark"));
  };

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
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = (textType) => {
    setActiveTab(textType);
    if (textType === "Home") navigate("/");
    if (textType === "Create") setOpen(true);
    if (textType === "More") setShowMoreDialog(true);
    if (textType === "Profile") navigate(`/profile/${user?._id}`);
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
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.profilePicture} className="object-cover" />
            <AvatarFallback className="bg-gray-200">U</AvatarFallback>
          </Avatar>
        </Link>
      ),
      text: "Profile",
      showOnMobile: true,
    },
  ];

  return (
    <>
      {/* Sidebar for tablets and desktops */}
      <nav className="hidden md:flex fixed top-0 left-0 h-screen w-20 md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col justify-between py-4 px-2 z-20">
        <div className="flex flex-col h-full w-full justify-between">
          <div>
            <h1 className="text-xl font-bold px-4 mt-0 mb-4 hidden md:block">
              LOGO
            </h1>

            <div className="flex flex-col gap-2 mb-6">
              {sidebarItems.map((item, index) => (
                <button
                  onClick={() => sidebarHandler(item.text)}
                  key={index}
                  className={`flex items-center space-x-3 w-full py-2 px-4 rounded-lg transition
  ${activeTab === item.text
    ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-semibold"
    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
  }`}>
                  <div className="w-6 h-6">{item.icon}</div>
                  <span className="hidden md:inline text-sm font-medium">
                    {item.text}
                  </span>
                </button>
              ))}
            </div>

            <div className="px-2">
              <SuggestedUsers />
            </div>
          </div>

          <div className="px-4 mt-4">
            <button
              onClick={() => sidebarHandler("More")}
              className="flex items-center gap-2 text-sm text-black w-full dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-2 rounded-md transition">
              <Menu size={25} />
              <span className="hidden md:inline font-bold">More</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-14 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center z-20">
        {sidebarItems
          .filter((item) => item.showOnMobile)
          .map((item, index) => (
            <button
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className={`flex items-center justify-center text-xs
  ${activeTab === item.text
    ? "text-black dark:text-white font-bold"
    : "text-gray-600 dark:text-gray-300"
  }`}>
              <div className="w-6 h-6">{item.icon}</div>
            </button>
          ))}
      </nav>

      <CreatePost open={open} setOpen={setOpen} />

      {/* More Dialog */}
      {showMoreDialog && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setShowMoreDialog(false)}>
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-[90%] max-w-sm space-y-4"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              More Options
            </h2>

            <button
              onClick={toggleTheme}
              className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>

            <button
              onClick={logoutHandler}
              className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftSideBar;
