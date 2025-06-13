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
import Cropper from "react-easy-crop";
import getCroppedImg from "./utils/getCroppedImage";
import { ImEmbed } from "react-icons/im";

const CreatePost = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [objectFit, setObjectFit] = useState("contain");
  const [manualAspect, setManualAspect] = useState(false); // manual toggle

  // Callback
  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

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

  const [aspect, setAspect] = useState(4 / 5); // default for portrait
  const computedAspect = manualAspect
    ? aspect === 4 / 5
      ? 16 / 9
      : 4 / 5
    : aspect;

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const ratio = img.width / img.height;
        if (ratio > 1.3) {
          setAspect(16 / 9); // cinematic
        } else {
          setAspect(4 / 5); // portrait default
        }
      };
      setImage(dataUrl);
      setManualAspect(false);
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
    try {
      setLoading(true);
      let croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", croppedBlob, file.name);

      const res = await axios.post(
        "http://localhost:8000/api/v2/post/addpost",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
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
      <DialogContent className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full sm:max-w-lg p-4 max-h-[90vh] overflow-y-auto flex flex-col space-y-4">
        <DialogHeader className="text-center font-semibold text-gray-900 dark:text-white">
          Create New Post
        </DialogHeader>

        {/* User Info */}
        <div className="flex gap-3 items-center">
          <Avatar className="h-8 w-8">
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

        {/* Caption */}
        <Textarea
          placeholder="Write a caption..."
          className="focus-visible:ring-transparent border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {image && (
          <div className="relative w-full aspect-video sm:aspect-[4/5] bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden max-h-[60vh] min-h-[300px]">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={computedAspect}
              cropShape="rect"
              showGrid={false}
              objectFit="contain"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />

            {/* Overlay info + toggle */}
            <div className="absolute bottom-2 right-2 z-10 flex items-center gap-2">
              <button
                onClick={() => {
                  setManualAspect(true);
                  setAspect((prev) => (prev === 4 / 5 ? 16 / 9 : 4 / 5));
                }}
                className="text-xs underline text-blue-600 dark:text-blue-400 no-underline py-1 px-2 bg-blue-200 rounded-sm ">
                <ImEmbed />
              </button>
            </div>
          </div>
        )}

        {/* File Input */}
        <Input
          ref={imageRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={fileChangeHandler}
        />

        {/* Unsaved Warning */}
        {showWarning && (
          <div className="text-sm text-red-500 text-center">
            You have unsaved changes.{" "}
            <button
              onClick={discardChanges}
              className="underline underline-offset-2 text-red-700 hover:text-red-600">
              Discard
            </button>{" "}
            or continue editing.
          </div>
        )}

        {/* Post Button */}
        <div className="mt-2">
          <Button
            type="button"
            disabled={loading}
            onClick={image ? handleSubmit : () => imageRef.current.click()}
            className={`w-full ${
              image
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-gray-950 dark:bg-white dark:text-black text-white hover:bg-gray-800 dark:hover:bg-gray-200"
            }`}>
            {loading
              ? "Posting..."
              : image
              ? "Post"
              : "Choose from Computer/Phone"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
