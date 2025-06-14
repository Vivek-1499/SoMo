import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen, post }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v2/post/${selectedPost?._id}/comment`,
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
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`
          bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
          w-full md:max-w-5xl p-0 shadow-xl overflow-hidden 
          h-[60vh] md:h-[70vh] 
          rounded-t-xl md:rounded-lg 
          flex flex-col md:flex-row
          fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
          bottom-0 md:bottom-auto
        `}>
        {/* Left Image */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src={post.image}
            alt="post_img"
            className="w-full h-full max-h-full object-contain bg-gray-50 dark:bg-gray-800 p-4 md:rounded-l-lg"
          />
        </div>

        {/* Right Comment Panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src={post.author?.profilePicture}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-300">U</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-sm hover:underline">
                    {post.author?.username}
                  </Link>
                </div>
              </div>

              {/* More Options */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="w-64 p-4 space-y-2 text-sm bg-white dark:bg-gray-900">
                  <div className="cursor-pointer text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-gray-800 p-2 rounded">
                    Unfollow
                  </div>
                  <div className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white p-2 rounded">
                    Add to Favourite
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {
              post.caption &&
              <div className="flex gap-3 ml-4 mt-3 items-center">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src={post.author?.profilePicture}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-300">U</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-sm hover:underline">
                    {post.author?.username}
                  </Link>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {post.caption}
              </p>
            </div>
            }
            
          </div>

          <div className="p-4 text-sm text-gray-600 dark:text-gray-300 overflow-y-auto flex-1 ">
            {comment.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>

          {/* Comment Input */}
          <div className="p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={text}
                onChange={changeEventHandler}
                className="w-full outline-none border border-gray-300 p-2 rounded dark:bg-gray-800 text-sm"
              />
              <Button
                disabled={!text.trim()}
                onClick={sendMessageHandler}
                variant="outline">
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
