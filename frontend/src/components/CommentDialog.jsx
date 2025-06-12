import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const {user} = useSelector(store => store.auth)
  const changeEventHandler = (e) =>{
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText);
    }else{
      setText('');
    }
  }
  const sendMessageHandler = async(e)=>{
    alert(text);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`
          bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
          w-full md:max-w-5xl p-0 shadow-xl overflow-hidden 
          h-[60vh] md:h-[70vh] 
          rounded-t-xl md:rounded-lg 
          flex flex-col md:flex-row

          /* Center it on desktop */
          fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
          bottom-0 md:bottom-auto
        `}>
        {/* Left Image Section - hidden on mobile */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src="https://images.unsplash.com/photo-1749482843703-3895960e7d63?q=80&w=1936&auto=format&fit=crop"
            alt="post_img"
            className="w-full md:max-2xl: h-full object-cover md:rounded-l-lg"
          />
        </div>

        {/* Right Comment Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-3 items-center">
              <Link>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} className='object-cover'/>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link className="font-semibold text-sm hover:underline">
                  {user?.username}
                </Link>
              </div>
            </div>

            {/* More options trigger */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="w-64 p-4 space-y-2 text-sm bg-gray-900">
                <div className="cursor-pointer text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-gray-800 p-2 rounded">
                  Unfollow
                </div>
                <div className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white p-2 rounded">
                  Add to Favourite
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="p-4 text-sm text-gray-600 dark:text-gray-300 overflow-y-auto flex-1">
            Comments or additional content goes here...
          </div>
          <div className="p-4">
            <div>
              <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={text}
                onChange={changeEventHandler}
                className="w-full outline-none border border-gray-300 p-2 rounded dark:bg-gray-800"
              />
              <Button disabled={!text.trim()} onClick={sendMessageHandler}
            variant="outline">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
