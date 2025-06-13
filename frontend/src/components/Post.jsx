import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

const Post = ({ post }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v2/post/delete/${post?._id}`,
        {
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        // Update Redux or UI
        const updatedPostData = posts.filter((p) => p._id !== post?._id);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      } else {
        toast.error("Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Could not delete post.");
    }
  };

  const likeDislike = async () => {
    if (loading) return; // prevent spam
    setLoading(true);
    try {
      const action = liked ? "unlike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v2/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLike = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLike);
        setLiked(!liked);
        toast.success(res.data.message);
      } else {
        toast.error("Action failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-5 w-full max-w-md mx-auto rounded-xl shadow-sm bg-white dark:bg-gray-900 p-3 sm:p-4 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="bg-slate-200 w-9 h-9">
            <AvatarImage
              src={post.author?.profilePicture}
              alt="post-image"
              className="object-cover"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <h1 className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {post.author.username}
          </h1>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-white" />
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-zinc-900 rounded-xl w-full sm:max-w-lg p-4 space-y-4 max-h-[90vh] overflow-y-auto">
            <Button
              variant="ghost"
              className="text-red-500 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white px-4 py-2 rounded-md">
              Unfollow
            </Button>
            <Button
              variant="ghost"
              className="font-semibold dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white px-4 py-2 rounded-md">
              Add to Favourite
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="text-red-500 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white px-4 py-2 rounded-md">
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-2">
          {post.caption}
        </p>
      )}

      {/* Post Image */}
      <div className="w-full rounded-md mb-2 overflow-hidden bg-gray-50 dark:bg-gray-800 aspect-[4/5] sm:aspect-[3/4]">
        <img
          src={post.image}
          alt="post_img"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-1 text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-4">
          {liked ? (
            <FaHeart
              onClick={likeDislike}
              size={20}
              className="cursor-pointer text-red-500 transition-colors"
            />
          ) : (
            <FaRegHeart
              onClick={likeDislike}
              size={20}
              className="cursor-pointer hover:text-red-500 transition-colors"
            />
          )}

          <MessageCircle
            onClick={() => setOpen(true)}
            size={20}
            className="cursor-pointer hover:text-blue-500 transition-colors"
          />
          <Send
            size={20}
            className="cursor-pointer hover:text-green-500 transition-colors"
          />
        </div>
        <Bookmark
          size={20}
          className="cursor-pointer hover:text-yellow-500 transition-colors"
        />
      </div>

      {/* Likes */}
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">
        {postLike} likes
      </span>

      {/* View Comments */}
      <span
        onClick={() => setOpen(true)}
        className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer mb-1 block">
        View all comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} post={post} />

      {/* Add Comment */}
      <div className="flex items-center justify-between mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full bg-transparent text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        {text && (
          <span className="text-blue-500 text-sm font-medium cursor-pointer ml-2">
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
