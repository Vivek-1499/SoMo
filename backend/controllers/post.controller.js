import sharp from 'sharp';
import { Post } from '../models/post.model.js';
import cloudinary from '../utils/cloudinary.js';
import { User } from '../models/user.model.js';
import { Comment } from '../models/comment.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

export const addNewPost = async(req, res) =>{
  try {
    const {caption} = req.body;
    const image = req.file;
    const authorId = req.id;

    if(!image) return res.status(400).json({message: "Image required"});
    
    const optimizedImageBuffer = await sharp(image.buffer)
    .resize({width:800, height: 800, fit: 'inside'})
    .toFormat('jpeg', {quality: 80})
    .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId
    });

    const user = await User.findById(authorId);
    if(user){
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({path: 'author', select: '-password'});
    return res.status(201).json({
      message: 'New post added',
      post,
      success:true
    })

  } catch (error) {
    console.log(error);
  }
}

export const getAllPost = async(req,res) =>{
  try {
    const posts = await Post.find().sort({createdAt:-1})
    .populate({path:'author', select:'username profilePicture'})
    .populate({
      path:'comments',
      sort:{createdAt:-1},
      populate:{
        path:'author',
        select:'username profilePicture'
      }
    })
    return res.status(200).json({
      posts,
      success: true
    })
  } catch (error) {

    console.log(error)
  }
}

export const getUserPost =async (req,res) =>{
  try {
    const authorId = req.id;
    const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({
      path: 'author',
      select: 'username, profilePicture'
    }).populate({
      path:'comments',
      sort:{createdAt:-1},
      populate:{
        path:'author',
        select:'username, profilePicture'
      }
    })
    return res.status(200).json({
      posts,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}

export const likePost = async(req, res) =>{
  try{
    const liker = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if(!post){
      return res.status(404).json({
        message:'Post Not found',
        success: false
      })
    }

    await post.updateOne({$addToSet: {likes: liker}}); //only one like per user

    //Socket io for real time notification
    const user = await User.findById(liker).select('username profilePicture')
    const postOwnerId = post.author.toString();
    if(postOwnerId !== liker){
      const notification ={
        type: 'like',
        userId: liker,
        userDetails: user,
        postId,
        message: 'Your post was likes'
      }
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
      io.to(postOwnerSocketId).emit('notification', notification);
    }

    }


    return res.status(200).json({message:'Post Liked', success: true})

  }catch(error){
    console.log(error)
  }
}

export const unLikePost = async(req, res) =>{
  try{
    const liker = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if(!post){
      return res.status(404).json({
        message:'Post Not found',
        success: false
      })
    }

    await post.updateOne({$pull: {likes: liker}}); //only one like per user

    //Socket io for real time notification
    const user = await User.findById(liker).select('username profilePicture')
    const postOwnerId = post.author.toString();
    if(postOwnerId !== liker){
      const notification ={
        type: 'unlike',
        userId: liker,
        userDetails: user,
        postId,
        message: 'Your post was unliked'
      }
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit('notification', notification);
      }
    }

    return res.status(200).json({message:'Post unliked', success: true})

  }catch(error){
    console.log(error)
  }
}

export const addComment = async(req,res)=>{
  try {
    const postId = req.params.id;
    const commentor = req.id;

    const {text} = req.body;
    const post = await Post.findById(postId);

    if(!text) return res.status(400).json({message:'no text', success: false});

    const comment = await Comment.create({
      text,
      author: commentor,
      post: postId
    })
    const populatedComment = await Comment.findById(comment._id).populate({
    path: 'author',
    select: 'username profilePicture'  // also fixed spelling from `slect`
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({
      comment: populatedComment,
      message: 'comment added',
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}

export const getComments = async (req, res) =>{
  try {
    const postId = req.params.id;
    const comments = await Comment.find({post:postId})
    .populate('author', 'username profilePicture')
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
        select: 'username profilePicture'
      }
    });

    if(!comments){
      return res.status(404).json({
      comments,
      message: 'no comments',
      success: false
    })
    }

    return res.status(200).json({success: true, comments});
  } catch (error) {
    console.log(error)
  }
}

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found', success: false });

    if (post.author.toString() !== authorId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this post', success: false });
    }

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(authorId);
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: 'Post deleted',
      success: true
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async(req, res) =>{
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);

    if(!post) return res.status(404).json({message:'Post not found', success: false});

    const user = await User.findById(authorId);
    if(user.bookmarks.includes(post._id)){
      await user.updateOne({$pull:{bookmarks: post._id}});
      await user.save();
      return res.status(200).json({type: 'unsaved', message: 'Post removed from bookmark', success: true})

    }else{
      await user.updateOne({$addToSet:{bookmarks: post._id}});
      await user.save();
      return res.status(200).json({type: 'unsaved', message: 'Post added to bookmark', success: true})

    }
  } catch (error) {
    console.log(error)
  }
}

export const replyToComment = async (req, res) => {
  try {
    const commentId = req.params.id; // parent comment ID
    const replierId = req.id;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Reply text is required" });

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) return res.status(404).json({ message: "Comment not found" });

    const reply = await Comment.create({
      text,
      author: replierId,
      post: parentComment.post,
    });

    parentComment.replies.push(reply._id);
    await parentComment.save();

    const populatedReply = await Comment.findById(reply._id).populate("author", "username profilePicture");

    return res.status(201).json({
      message: "Reply added",
      reply: populatedReply,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

