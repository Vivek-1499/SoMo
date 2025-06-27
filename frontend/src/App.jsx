import {
  BrowserRouter,
  createBrowserRouter,
  Link,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Auth from "./components/Auth";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setCommentNotification, setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotificationsPage from "./components/NotificationsPage";

const browserRouter = createBrowserRouter([
  {
    path: "/login",
    element: <Auth />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    errorElement: (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">404 - Page Not Found</h2>
          <p className="text-gray-600">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Link to="/" className="text-blue-500 underline mt-4 block">
            Go to Home
          </Link>
        </div>
      </div>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element:<Profile key={location.pathname} />,
      },
      {
        path: "/account/edit",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
      {
        path: "/notifications",
        element: <NotificationsPage />,
      },
      {
        path:"/chat/:userId",
        element: <ChatPage/>
      },
    ],
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        if (notification.type === "like") {
          console.log("Received notification:", notification);
          dispatch(setLikeNotification(notification));
        } else if (notification.type === "comment") {
          dispatch(setCommentNotification(notification));
        }
      });

      return () => {
        socketio.disconnect();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.disconnect();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v2/user/profile",
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setAuthUser(res.data.user)); // includes bookmarks
        }
      } catch (err) {
        console.log("Failed to fetch user profile:", err);
      }
    };

    fetchUserProfile();
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
