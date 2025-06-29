import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { FaComment } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { toast } from "sonner";
import { setUserProfile } from "@/redux/authSlice";
import FollowModal from "./FollowModal";
import { api } from "./utils/api";

const Profile = () => {
  const { id: userId } = useParams();
  const [activeTabs, setActiveTabs] = useState("post");
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followType, setFollowType] = useState("");
  const { userProfile, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !user?._id) return;

      setProfileLoading(true);
      try {
        const res = await api.get(`/user/${userId}/profile`);
        if (res.data.success && res.data.user) {
          dispatch(setUserProfile(res.data.user));
          setIsFollowing(!!res.data.followType);
          setFollowType(res.data.followType || "");
          setFollowersCount(res.data.user.followers?.length || 0);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [userId, user]);

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    return words[0]?.[0]?.toUpperCase() + (words[1]?.[0]?.toUpperCase() || "");
  };

  const handleTabChange = (tab) => {
    setActiveTabs(tab);
  };

  const refreshProfile = async (currentUserId = user?._id) => {
    try {
      const res = await api.get(`/user/${userId}/profile`);
      if (res.data.success) {
        dispatch(setUserProfile(res.data.user));
        setIsFollowing(!!res.data.followType);
        setFollowType(res.data.followType || "");
        setFollowersCount(res.data.user.followers?.length || 0);
      }
    } catch (err) {
      console.error("Failed to refresh profile");
    }
  };

  const handleFollow = async (silent = false) => {
    if (!userProfile?._id) return;
    setLoadingFollow(true);
    try {
      const res = await api.post(
        `/user/followUnfollowUser/${userProfile._id}`,
        {
          action: silent ? "silent" : "follow",
        }
      );
      if (res.data.success) {
        toast.success(silent ? "Silently followed!" : "Followed!");
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        await refreshProfile(user._id);
      }
    } catch (err) {
      console.error("Follow failed", err);
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleUnfollow = async () => {
    setLoadingFollow(true);
    try {
      const res = await api.post(
        `/user/followUnfollowUser/${userProfile._id}`,
        {
          action: "unfollow",
        }
      );
      if (res.data.success) {
        toast.success("Unfollowed!");
        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(0, prev - 1));
        await refreshProfile(user._id);
      }
    } catch (err) {
      console.error("Unfollow failed", err);
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleShowFollowModal = (type = "") => {
    setFollowType(type);
    setShowFollowModal(true);
  };
  const handleFollowAction = async () => {
    setShowFollowModal(false);
    await handleFollow(false); // sets followType in refreshProfile
  };

  const handleSilentFollowAction = async () => {
    setShowFollowModal(false);
    await handleFollow(true);
  };

  const handleUnfollowAction = async () => {
    setShowFollowModal(false);
    await handleUnfollow();
  };
  const canFollow = !isFollowing || followType === "silent";
  const canSilentFollow = !isFollowing || followType === "follow";

  const displayPost =
    activeTabs === "post" ? userProfile?.posts : userProfile?.bookmarks;
  const isLoggedInUser =
    !!user && !!userProfile && user._id === userProfile._id;
  if (profileLoading || !userProfile) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen">
      <div className="relative w-full h-40 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 " />

      <div className="mt-[-70px] px-6 flex flex-col sm:flex-row sm:items-start sm:pl-[300px] sm:gap-8 items-center mb-1">
        <div className="flex flex-col items-center">
          <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white dark:border-gray-900">
            <AvatarImage
              src={userProfile?.profilePicture}
              alt="User avatar"
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
              {getInitials(userProfile?.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 text-center sm:text-left">
            <h2 className="text-xl font-semibold flex justify-center sm:justify-start items-center gap-2">
              {userProfile?.username || "Unnamed User"}
              {userProfile?.isVerified && (
                <span className="bg-blue-500 text-white px-1.5 py-0.5 text-xs rounded-full">
                  ✔
                </span>
              )}
            </h2>
            {userProfile?.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:hidden">
                {userProfile.bio}
              </p>
            )}
          </div>

          <div className="mt-4 flex justify-center sm:justify-start gap-2">
            {isLoggedInUser ? (
              <>
                <Link to={"/account/edit"}>
                  <Button
                    variant="secondary"
                    className="text-xs hover:bg-purple-400 bg-purple-300 dark:bg-purple-900 dark:text-white hover:dark:bg-purple-950 h-8">
                    Edit Profile
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  className="text-xs hover:bg-purple-400 bg-purple-300 dark:bg-purple-900 dark:text-white hover:dark:bg-purple-950 h-8">
                  View Archive
                </Button>
                <Button
                  variant="secondary"
                  className="text-xs hover:bg-purple-400 bg-purple-300 dark:bg-purple-900 dark:text-white hover:dark:bg-purple-950 h-8">
                  Ad tools
                </Button>
              </>
            ) : !isFollowing && followType === "" ? (
              <>
                <Button
                  onClick={() => handleShowFollowModal()}
                  disabled={loadingFollow}
                  className="text-sm hover:bg-purple-400 bg-purple-300 dark:bg-purple-900 dark:text-white hover:dark:bg-purple-950 h-8">
                  Follow
                </Button>
                <Button
                  onClick={() => navigate(`/chat/${userProfile._id}`)}
                  variant="secondary"
                  className="text-sm hover:bg-purple-400 bg-purple-300 dark:bg-purple-900 dark:text-white hover:dark:bg-purple-950 h-8">
                  Message
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => handleShowFollowModal(followType)}
                  disabled={loadingFollow}
                  className="text-sm hover:bg-purple-400 bg-purple-300 dark:bg-purple-900 dark:text-white hover:dark:bg-purple-950 h-8">
                  {loadingFollow
                    ? "..."
                    : followType === "silent"
                    ? "Silent Following"
                    : "Following"}
                </Button>
                <Button
                  variant="secondary"
                  className="text-sm hover:bg-purple-400 bg-purple-300 dark:bg-purple-900 dark:text-white hover:dark:bg-purple-950 h-8">
                  Message
                </Button>
              </>
            )}
          </div>

          <div className="flex justify-between sm:hidden gap-10 mt-6 text-center w-full">
            <div>
              <p className="font-bold text-lg">
                {userProfile?.posts?.length || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
            </div>
            <div>
              <p className="font-bold text-lg">{followersCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Followers
              </p>
            </div>
            <div>
              <p className="font-bold text-lg">
                {userProfile?.following?.length || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Followings
              </p>
            </div>
          </div>
        </div>

        {/* Right side info */}
        <div className="flex flex-col w-full sm:ml-20">
          <div className="hidden sm:flex flex-row gap-10 items-center mt-20 text-center">
            <div>
              <p className="font-bold text-2xl">
                {userProfile?.posts?.length || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
            </div>
            <div>
              <p className="font-bold text-2xl">
                {userProfile?.followers?.length || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Followers
              </p>
            </div>
            <div>
              <p className="font-bold text-2xl">
                {userProfile?.following?.length || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Followings
              </p>
            </div>
          </div>

          <div className="mt-3 hidden sm:block">
            {userProfile?.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {userProfile.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-20 px-6 sm:px-0 sm:grid sm:grid-cols-[auto_1fr] sm:gap-10 sm:pl-[350px]">
        {/* Sidebar / Tab Selector */}
        <div className="flex flex-row sm:flex-col gap-4 justify-center sm:justify-start sm:border-r border-indigo-300 pr-0 sm:pr-6 mb-6 sm:mb-0 border-b-2 sm:border-b-0 pb-4 rounded-b-lg sm:rounded-b-lg">
          <span
            className={`w-fit px-4 py-2 cursor-pointer font-bold rounded-md transition 
        ${
          activeTabs === "post"
            ? "rounded-lg border-b-4 bg-indigo-100 border-indigo-600 text-gray-600 dark:bg-indigo-800 dark:text-white"
            : "text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900"
        }`}
            onClick={() => handleTabChange("post")}>
            Post
          </span>
          <span
            className={`w-fit px-4 py-2 cursor-pointer font-bold rounded-md transition 
        ${
          activeTabs === "saved"
            ? "rounded-lg border-b-4 bg-indigo-100 border-indigo-600 text-gray-600 dark:bg-indigo-800 dark:text-white"
            : "text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900"
        }`}
            onClick={() => handleTabChange("saved")}>
            Saved
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {displayPost?.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10 col-span-full">
              No {activeTabs === "post" ? "posts" : "saved posts"} yet.
            </div>
          ) : (
            displayPost.map((post) => (
              <div
                onClick={() => {
                  setSelectedPost(post);
                  setOpen(true);
                }}
                key={post._id}
                className="relative group rounded overflow-hidden shadow cursor-pointer">
                <img
                  src={post.image}
                  alt={post.caption || "Post image"}
                  className="w-full h-[200px] object-cover group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-0 transition-all duration-300 flex items-center justify-center">
                  <div className="flex gap-4 text-white font-semibold text-sm sm:text-base opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                    <div className="flex items-center gap-1">
                      <Heart /> {post.likes?.length || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaComment /> {post.comments?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Post Detail Dialog */}
        {selectedPost && (
          <CommentDialog open={open} setOpen={setOpen} post={selectedPost} />
        )}
      </div>
      <FollowModal
        isOpen={showFollowModal}
        onClose={() => setShowFollowModal(false)}
        onFollow={canFollow ? handleFollowAction : undefined}
        onSilentFollow={canSilentFollow ? handleSilentFollowAction : undefined}
        onUnfollow={isFollowing ? handleUnfollowAction : undefined}
      />
    </div>
  );
};
export default Profile;
