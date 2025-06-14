import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  text:{type:String, required: true},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  post:{type: mongoose.Schema.Types.ObjectId, ref:'Post', required: true},
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
},{ timestamps: true })

export const Comment = mongoose.model('Comment', commentSchema);