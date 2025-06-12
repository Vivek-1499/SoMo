import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const dispatch = useDispatch();
  const {posts} = useSelector(store => store.post)

  // Delayed reset to avoid aria-hidden + focus conflict
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setFile(null);
        setCaption("");
        setImage("");
        setShowWarning(false);
      }, 200); // allow Dialog animation to complete
    }
  }, [open]);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImage(dataUrl);
    }
  };

  const handleClose = () => {
    if (image && !file?.posted) {
      setShowWarning(true);
    } else {
      setOpen(false);
    }
  };

  const discardChanges = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (image) formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v2/post/addpost",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([...posts, res.data.post]))  // adds posts
        toast.success(res.data.message);
        setFile({ ...file, posted: true });
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full sm:max-w-lg p-4 space-y-4">
        <DialogHeader className="text-center font-semibold text-gray-900 dark:text-white">
          Create New Post
        </DialogHeader>

        <div className="flex gap-3 items-center">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.profilePicture} className="object-cover" />
            <AvatarFallback className="bg-gray-200">U</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm text-gray-800 dark:text-white">
              {user?.username || "Username"}
            </h1>
            <span className="text-gray-600 dark:text-gray-400 text-xs">
              Bio here...
            </span>
          </div>
        </div>

        <Textarea
          placeholder="Write a caption..."
          className="focus-visible:ring-transparent border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {image && (
          <div className="w-full max-h-64 overflow-hidden rounded-lg border dark:border-zinc-700">
            <img
              src={image}
              alt="preview"
              className="object-contain w-full h-full"
            />
          </div>
        )}

        <Input
          ref={imageRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={fileChangeHandler}
        />

        {showWarning && (
          <div className="text-sm text-red-500 text-center">
            You have unsaved changes.{" "}
            <button
              onClick={discardChanges}
              className="underline underline-offset-2 text-red-700 hover:text-red-600"
            >
              Discard
            </button>{" "}
            or continue editing.
          </div>
        )}

        <div className="flex justify-center">
          <Button
            type="button"
            disabled={loading}
            onClick={image ? handleSubmit : () => imageRef.current.click()}
            className={`w-full sm:w-auto ${
              image
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-gray-950 dark:bg-white dark:text-black text-white hover:bg-gray-800 dark:hover:bg-gray-200"
            }`}
          >
            {loading ? "Posting..." : image ? "Post" : "Choose from Computer/Phone"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
