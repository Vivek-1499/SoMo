import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Auth from "./components/Auth";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/Profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);
function App() {
  return (
    <>
      <button
        onClick={() => document.documentElement.classList.toggle("dark")}
        className="absolute top-4 right-4 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded">
        Toggle Mode
      </button>

      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
