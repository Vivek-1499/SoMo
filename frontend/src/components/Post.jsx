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
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const Post = ({ post }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [comment, setComment] = useState(post.comments);
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
        { withCredentials: true }
      );
      if (res.data?.success) {
        const updatedPostData = posts.filter((p) => p._id !== post._id);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      } else {
        toast.error("Delete failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete post.");
    }
  };

  const likeDislike = async () => {
    if (loading) return;
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

        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPosts));
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

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v2/post/${post?._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.message];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));

        dispatch(setSelectedPost({ ...post, comments: updatedCommentData }));

        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-5 w-full max-w-md mx-auto rounded-xl shadow-sm bg-white dark:bg-gray-900 p-3 sm:p-4 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="bg-slate-200 w-9 h-9">
            <AvatarImage
              src={post.author?.profilePicture}
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
            <Button variant="ghost" className="text-red-500">
              Unfollow
            </Button>
            <Button variant="ghost" className="dark:text-gray-300">
              Add to Favourite
            </Button>
            {user && user._id === post.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="text-red-500">
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          {post.caption}
        </p>
      )}
      {/* Image */}
      <div className="w-full rounded-md mb-2 overflow-hidden bg-gray-50 dark:bg-gray-800 aspect-[4/5] sm:aspect-[3/4]">
        <img
          src={post.image}
          alt="post_img"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Action Icons */}
      <div className="flex items-center justify-between mb-1 text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-4">
          {liked ? (
            <FaHeart
              onClick={likeDislike}
              size={20}
              className="cursor-pointer text-red-500"
            />
          ) : (
            <FaRegHeart
              onClick={likeDislike}
              size={20}
              className="cursor-pointer hover:text-red-500"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post)); // fix: ensure selected post is synced
              setOpen(true);
            }}
            size={20}
            className="cursor-pointer hover:text-blue-500"
          />
          <Send size={20} className="cursor-pointer hover:text-green-500" />
        </div>
        <Bookmark size={20} className="cursor-pointer hover:text-yellow-500" />
      </div>

      {/* Like Count */}
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">
        {postLike} likes
      </span>

      {/* Comment Count Link */}
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer mb-1 block">
          View all {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} post={post} />

      {/* Comment Input */}
      <div className="flex items-center justify-between mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full bg-transparent text-gray-700 dark:text-gray-200"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-blue-500 text-sm font-medium cursor-pointer ml-2">
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
