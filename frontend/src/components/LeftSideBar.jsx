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
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useState, useEffect } from "react";
import CreatePost from "./CreatePost";
import SuggestedUsers from "./SuggestedUsers";
import { markNotificationsAsSeen } from "@/redux/rtnSlice";
import { api } from "./utils/api";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const [showMoreDialog, setShowMoreDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const { notifications = [] } = useSelector(
    (store) => store.realTimeNotification
  );
  const unseenCount = notifications.filter((n) => !n.seen).length;

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setIsDarkMode(html.classList.contains("dark"));
  };

  const logoutHandler = async () => {
    try {
      const res = await api.get("/user/logout")
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
    if (textType === "Messages") navigate(`/chat`);
    if (textType === "Notifications" && isMobileView)
      navigate("/notifications");
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
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
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
              {sidebarItems.map((item, index) => {
                const isNotifications = item.text === "Notifications";
                return (
                  <div key={index} className="relative">
                    {isNotifications && !isMobileView ? (
                      <Popover
                        onOpenChange={(open) => {
                          if (open) dispatch(markNotificationsAsSeen());
                        }}>
                        <PopoverTrigger asChild>
                          <button
                            onClick={() => sidebarHandler(item.text)}
                            className={`flex items-center space-x-3 w-full py-2 px-4 rounded-lg transition ${
                              activeTab === item.text
                                ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-semibold"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}>
                            <div className="relative w-6 h-6">
                              {item.icon}
                              {unseenCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                  {unseenCount}
                                </span>
                              )}
                            </div>
                            <span className="hidden md:inline text-sm font-medium">
                              {item.text}
                            </span>
                          </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-72 bg-indigo-50 dark:bg-gray-950 dark:text-white">
                          <div className="space-y-3 max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <p className="text-sm text-gray-500 text-center">
                                No Notifications
                              </p>
                            ) : (
                              notifications.map((notification, idx) => (
                                <Link
                                  to={`/post/${notification.postId}`}
                                  key={idx}
                                  onClick={() => setShowMoreDialog(false)}
                                  className="flex gap-3 items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded transition">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={
                                        notification.userDetails?.profilePicture
                                      }
                                      className="object-cover"
                                    />
                                    <AvatarFallback className="bg-gray-300">
                                      U
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm">
                                    <span className="font-bold">
                                      {notification.userDetails?.username}
                                    </span>{" "}
                                    {notification.type === "like"
                                      ? "liked your post"
                                      : `commented: "${notification.content}"`}
                                  </p>
                                </Link>
                              ))
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <button
                        onClick={() => sidebarHandler(item.text)}
                        className={`flex items-center space-x-3 w-full py-2 px-4 rounded-lg transition ${
                          activeTab === item.text
                            ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}>
                        <div className="relative w-6 h-6">
                          {item.icon}
                          {isNotifications && unseenCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                              {unseenCount}
                            </span>
                          )}
                        </div>
                        <span className="hidden md:inline text-sm font-medium">
                          {item.text}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
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

      {/* Bottom Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-14 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center z-20">
        {sidebarItems
          .filter((item) => item.showOnMobile)
          .map((item, index) => {
            const isNotifications = item.text === "Notifications";

            return (
              <button
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className={`relative flex items-center justify-center text-xs ${
                  activeTab === item.text
                    ? "text-black dark:text-white font-bold"
                    : "text-gray-600 dark:text-gray-300"
                }`}>
                <div className="w-6 h-6 relative">
                  {item.icon}
                  {isNotifications && unseenCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {unseenCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
      </nav>

      {/* Create Post Modal */}
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
