import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LeftSideBar from "./LeftSideBar";
import { MessageCircle } from "lucide-react";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const isMobile = window.innerWidth < 768;

  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (!(isMobile && isHomePage)) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 0) {
        setShowTopBar(false); // Scroll down → hide
      } else {
        setShowTopBar(true); // Scroll up → show
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, isMobile, lastScrollY]);

  return (
    <div className="flex">
      <LeftSideBar />

      {/* Mobile Top Bar only on Home page */}
      {isMobile && isHomePage && (
        <div
          className={`fixed top-0 left-0 w-full h-14 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:hidden transition-transform duration-300 ${
            showTopBar ? "translate-y-0" : "-translate-y-full"
          }`}>
          <h1 className="text-xl font-bold text-black dark:text-white">LOGO</h1>
          <button
            onClick={() => navigate("/chat")}
            className="text-black dark:text-white">
            <MessageCircle size={24} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1`}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
