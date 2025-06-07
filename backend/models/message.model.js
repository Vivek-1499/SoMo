import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message:{type:String, required:true},
  seenBy: [{type: mongoose.Schema.Types.ObjectId , ref: 'User'}]
},{ timestamps: true })
const Message = mongoose.model('Message', messageSchema);
export default Message;
