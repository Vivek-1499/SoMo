import { useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
  const { notifications = [] } = useSelector((store) => store.realTimeNotification);

  return (
    <div className="p-4 dark:bg-black bg-white min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p>No notifications yet</p>
        ) : (
          notifications.map((notification, index) => (
            <Link to={`/post/${notification.postId}`} key={index}>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={notification.userDetails?.profilePicture} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <p className="text-sm">
                  <span className="font-semibold">{notification.userDetails?.username}</span>{" "}
                  {notification.type === "like"
                    ? "liked your post"
                    : `commented: "${notification.content}"`}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
