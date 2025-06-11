import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

const Post = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto rounded-xl shadow-lg bg-white dark:bg-gray-900 p-4 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="bg-slate-200">
            <AvatarImage src="" alt="post-image" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <h1 className="font-medium text-gray-800 dark:text-gray-200">
            username
          </h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-white" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center bg-white dark:bg-gray-800 rounded-lg py-4 space-y-2 shadow-xl">
            <Button
              variant="ghost"
              className="cursor-pointer font-semibold text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-colors rounded-md px-4 py-2">
              Unfollow
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white dark:text-gray-300 transition-colors rounded-md px-4 py-2">
              Add to Favourite
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer font-semibold text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-colors rounded-md px-4 py-2">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <img
        className="rounded-md my-2 w-full aspect-auto object-cover"
        src="https://images.unsplash.com/photo-1749482843703-3895960e7d63?q=80&w=1936&auto=format&fit=crop"
        alt="post_img"
      />

      <div className="flex items-center justify-between my-2 text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-4">
          <FaRegHeart
            size={22}
            className="cursor-pointer hover:text-red-500 transition-colors"
          />
          <MessageCircle
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-blue-500 transition-colors"
          />
          <Send className="cursor-pointer hover:text-green-500 transition-colors" />
        </div>
        <Bookmark className="cursor-pointer hover:text-yellow-500 transition-colors" />
      </div>

      <span className="font-medium block text-gray-800 dark:text-gray-200 mb-1">
        1k likes
      </span>

      <p className="text-sm text-gray-800 dark:text-gray-300 mb-1">
        <span className="font-semibold mr-2 text-gray-900 dark:text-white">
          username
        </span>
        caption
      </p>

      <span onClick = {()=> setOpen(true)}className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">
        View all comments
      </span>
      <CommentDialog open={open} setOpen={setOpen}/>

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
