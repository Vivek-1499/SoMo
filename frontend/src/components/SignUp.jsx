import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { api } from "./utils/api";

const SignUp = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/user/register", input);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={input.username}
        onChange={handleChange}
        className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={input.email}
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
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUp;
