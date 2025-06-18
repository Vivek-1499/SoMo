import React, { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true); // check state
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: user.gender,
    username: user?.username,
    name: user?.name || "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePicture: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  useEffect(() => {
    const check = setTimeout(() => {
      if (input.username && input.username !== user.username) {
        setCheckingUsername(true);
        axios
          .get(`http://localhost:8000/api/v2/user/check-username`, {
            params: { username: input.username },
            withCredentials: true,
          })
          .then((res) => {
            setUsernameAvailable(!res.data.isTaken);
          })
          .catch((err) => console.log(err))
          .finally(() => setCheckingUsername(false));
      } else {
        setUsernameAvailable(true);
      }
    }, 100);
    return () => clearTimeout(check);
  }, [input.username]);

  const profilePicPreview = input.profilePicture instanceof File
  ? URL.createObjectURL(input.profilePicture)
  : input.profilePicture;

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    formData.append("username", input.username);
    formData.append("name", input.name);
    if (input.profilePicture) {
      formData.append("profilePicture", input.profilePicture);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v2/user/profile/edit",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
          username: res.data.user?.username,
          name: res.data.user?.name,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-gray-950 text-gray-900 dark:text-white px-6 py-10">
      {/* Top Title Row */}
      <h1 className="text-2xl font-bold mb-10 text-center sm:text-left  gap-10 max-w-4xl mx-auto">
        Edit Profile
      </h1>

      {/* Grid Layout: Image on Left, Edit Form on Right */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl mx-auto">
        {/* Left Column - Image */}
        <div className="flex flex-col items-center gap-4 sm:border-r-2 rounded-sm border-purple-950">
          <Avatar className="w-44 h-44">
            <AvatarImage

              src={profilePicPreview}
              alt="User avatar"
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-300 border-2 border-black dark:bg-gray-700">
              U
            </AvatarFallback>
          </Avatar>
          {<h1 className=" text-2xl">{user?.username}</h1>}
          <input
            onChange={fileChangeHandler}
            type="file"
            ref={imageRef}
            className="hidden"
          />
          <Button
         
            onClick={() => imageRef?.current.click()}
            className="text-sm bg-purple-500 hover:bg-purple-600 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white">
            Change Profile Picture
          </Button>
        </div>

        {/* Right Column - Edit Fields */}
        <div className="sm:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-900 border-indigo-300 dark:border-gray-700"
              placeholder={user?.bio}
              value={input.bio}
              name="bio"
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 border-indigo-300 focus:outline-none focus:ring-2 focus:border-transparent dark:border-gray-700"
              placeholder="Your Name"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 ${
                !usernameAvailable
                  ? "border-red-500 dark:border-red-500"
                  : "border-indigo-300 dark:border-gray-700"
              } focus:outline-none focus:ring-2 focus:border-transparent`}
              placeholder="Your Username"
              value={input.username}
              onChange={(e) => setInput({ ...input, username: e.target.value })}
            />
            {
            !usernameAvailable && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                Username is already taken
              </p>
            )}
            {usernameAvailable && input.username && input.username !== user.username && (
  <p className="text-green-600 dark:text-green-400 text-sm mt-1">
    ✅ Username is available
  </p>
)}

          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <Select
              defaultValue={input.gender}
              onValueChange={selectChangeHandler}>
              <SelectTrigger className="w-[180px] bg-white focus:outline-none focus:ring-1 focus:border-transparent dark:bg-gray-900 border-indigo-300 dark:border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white focus:outline-none focus:ring-1 focus:border-transparent dark:bg-gray-900 border-indigo-300 dark:border-gray-700">
                <SelectGroup className="text-gray-800 dark:text-gray-300">
                  <SelectItem
                    value="male"
                    className="hover:bg-indigo-100 hover:font-semibold dark:hover:bg-indigo-800 cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent">
                    Male
                  </SelectItem>
                  <SelectItem
                    value="female"
                    className="hover:bg-indigo-100 hover:font-semibold dark:hover:bg-indigo-800 cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent">
                    Female
                  </SelectItem>
                  <SelectItem
                    value="others"
                    className="hover:bg-indigo-100 hover:font-semibold dark:hover:bg-indigo-800 cursor-pointer focus:outline-none focus:ring-0 focus:border-transparent">
                    others
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end mr-10px">
            {loading ? (
              <Button className="  bg-purple-600 hover:bg-purple-700 text-white">
                <Loader2 className="h-4 w-4 animate-spin" /> Please Wait
              </Button>
            ) : (
              <Button
              onClick={() => setConfirmDialogOpen(true)}
               disabled={checkingUsername || loading}
                className="  bg-purple-600 hover:bg-purple-700 text-white">
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>
      {confirmDialogOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-center space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        Are you sure?
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Are you sure you want to update your profile?
      </p>
      <div className="flex justify-center gap-4 pt-2">
        <Button
          onClick={() => {
            setConfirmDialogOpen(false);
            editProfileHandler();
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Yes, Save
        </Button>
        <Button
          onClick={() => setConfirmDialogOpen(false)}
          className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default EditProfile;
