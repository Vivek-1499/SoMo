import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { markNotificationsAsSeen } from "@/redux/rtnSlice";
import { useEffect } from "react";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications = [] } = useSelector(
    (store) => store.realTimeNotification
  );
  useEffect(() => {
    dispatch(markNotificationsAsSeen());
  }, [dispatch]);

  return (
    <div className="p-4 dark:bg-black bg-white min-h-screen text-zinc-800 dark:text-zinc-100">
      <h2 className="text-xl font-bold mb-4 text-center">Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          No notifications yet
        </p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => {
            const timeAgo = notification.createdAt
              ? formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })
              : "Just now";

            return (
              <Link
                key={index}
                className="block rounded-xl bg-zinc-100 dark:bg-zinc-900 
  hover:bg-zinc-200 dark:hover:bg-zinc-800 
  shadow-sm dark:shadow-none border border-zinc-200 dark:border-zinc-800 
  transition p-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0 mt-1">
                    <AvatarImage
                      src={notification.userDetails?.profilePicture}
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-zinc-300 dark:bg-zinc-700 text-black dark:text-white">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-semibold">
                      {notification.userDetails?.username}
                    </span>{" "}
                    {notification.type === "like" ? (
                      <span>❤️ liked your post</span>
                    ) : (
                      <span>
                        💬 commented:{" "}
                        <span className="italic text-zinc-600 dark:text-zinc-400">
                          “{notification.content}”
                        </span>
                      </span>
                    )}
                    <div className="text-xs text-zinc-500 mt-1">{timeAgo}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
