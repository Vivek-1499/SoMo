import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body; //destrucutimg array getting all the data at once instead of using req.body.username ....
    if (!username || !email || !password) {
      return res.status(400).json({
        message: `All fields required(username, email, password)`,
        success: false,
      });
    }

    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return res.status(409).json({
        message: "Email/User alreday exists, try different email",
        success: false,
      });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        message: "This username is already taken, try another ",
        success: false,
      });
    }
    const hashPass = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashPass,
    });
    return res.status(201).json({
      message: "Account Created Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res.status(400).json({
        message: `All fields required(username, email, password)`,
        success: false,
      });
    }
    let user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email/username password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post && post.author && post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    ).then((posts) => posts.filter(Boolean));

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      posts: user.posts,
      bookmarks: user.bookmarks,
      following: user.following.map((f) => f.userId),
      followers: user.followers.map((f) => f.userId),
      gender: user.gender,
    };
    if (!process.env.SECRET_KEY)
      throw new Error("SECRET_KEY is not defined in .env");
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server issue",
      success: false,
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const viewerId = req.id;

    const user = await User.findById(userId)
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "bookmarks",
        options: { sort: { createdAt: -1 } },
      })
      .populate("followers.userId", "-password")
      .populate("following.userId", "-password");

    const isFollower = user.followers.find(
      (f) => f.userId?._id?.toString() === viewerId
    );
    const followType = isFollower?.type || "";

    return res.status(200).json({
      user,
      success: true,
      followType,
    });
  } catch (error) {
    console.error("GetProfile Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender, name, username } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      console.log("Uploading picture:", profilePicture.originalname);
      console.log("Buffer size:", profilePicture.buffer?.length);
      const fileUri = getDataUri(profilePicture);
      console.log("File URI starts with:", fileUri?.slice(0, 30));
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    if (name) user.name = name;
    if (username && username !== user.username) {
      const exists = await User.findOne({ username });
      if (exists && exists._id.toString() !== user._id.toString()) {
        return res
          .status(409)
          .json({ message: "Username already in use", success: false });
      }
      user.username = username;
    }

    await user.save(); //saves in database

    return res.status(200).json({
      message: "Profile Updates",
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        gender: user.gender,
        followers: user.followers.map((f) => f.userId),
        following: user.following.map((f) => f.userId),
        posts: user.posts,
        bookmarks: user.bookmarks,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.id;
    const { action } = req.body; // action = "follow", "silent", "unfollow"

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const followerIndex = targetUser.followers.findIndex(
      (f) => f.userId.toString() === currentUserId.toString()
    );
    const followingIndex = currentUser.following.findIndex(
      (f) => f.userId.toString() === targetUserId.toString()
    );

    const isFollowing = followerIndex !== -1;

    // 🟥 Unfollow
    if (action === "unfollow") {
      if (!isFollowing) {
        return res
          .status(400)
          .json({ success: false, message: "You're not following this user." });
      }

      targetUser.followers.splice(followerIndex, 1);
      if (followingIndex !== -1) {
        currentUser.following.splice(followingIndex, 1);
      }

      await targetUser.save();
      await currentUser.save();

      return res
        .status(200)
        .json({ success: true, message: "Unfollowed successfully" });
    }

    // 🟩 Follow / Silent Follow
    const followType = action === "silent" ? "silent" : "follow";

    if (isFollowing) {
      // 🟨 Already following → just change type
      targetUser.followers[followerIndex].type = followType;
      if (followingIndex !== -1) {
        currentUser.following[followingIndex].type = followType;
      }
    } else {
      // 🟦 Fresh follow
      targetUser.followers.push({ userId: currentUserId, type: followType });
      currentUser.following.push({ userId: targetUserId, type: followType });
    }

    await targetUser.save();
    await currentUser.save();

    return res.status(200).json({
      success: true,
      message: `${
        followType === "silent" ? "Silently followed" : "Followed"
      } successfully`,
      followType,
    });
  } catch (error) {
    console.error("Follow/Unfollow Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const userId = req.id;

    if (!username) {
      return res
        .status(400)
        .json({ message: "Username is required", success: false });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(200).json({ isTaken: true });
    }

    return res.status(200).json({ isTaken: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
