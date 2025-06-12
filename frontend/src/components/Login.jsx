import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v2/user/login",
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user))
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <input
        type="text"
        name="identifier"
        placeholder="Email or Username"
        value={input.identifier}
        onChange={handleChange}
        className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={input.password}
        onChange={handleChange}
        className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-black dark:bg-white text-white dark:text-black py-2 rounded hover:opacity-90 transition duration-300"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
