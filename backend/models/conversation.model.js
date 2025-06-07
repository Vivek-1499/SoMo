import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  name: { type: String }, //For group name
  isGroup: { type: Boolean, default: false },
  participants:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
  messages:[{type:mongoose.Schema.Types.ObjectId, ref:'Message'}]
},{ timestamps: true })

export const Conversation = mongoose.model('Conversation', conversationSchema);