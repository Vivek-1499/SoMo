import React, { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const activeTab =
    "text-black dark:text-white border-b-2 border-black dark:border-white";
  const inactiveTab =
    "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition duration-300";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Tabs */}
        <div className="flex justify-around border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-3 text-sm font-semibold text-center ${
              isLogin ? activeTab : inactiveTab
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-3 text-sm font-semibold text-center ${
              !isLogin ? activeTab : inactiveTab
            }`}
          >
            Sign Up
          </button>
        </div>
        {/* Branding */}
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold text-black dark:text-white">LOGO</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isLogin ? "Welcome back! Please login to your account." : "Join us! Create your account."}
          </p>
        </div>


        {/* Form */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <Login />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <SignUp />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;
