import { Conversation } from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!message)
      return res
        .status(400)
        .json({ success: false, error: "Message text required" });

    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        isGroup: false,
      });
    }
    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      message,
    });
    if (newMessage) conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    //SOcket io for real time data transfer
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage); // keep this for syncing messages
      io.to(receiverSocketId).emit("newMessageNotification", {
        from: senderId,
        message: newMessage.message,
        timestamp: newMessage.createdAt,
      });
    }

    return res.status(200).json({
      newMessage,
      success: true,
    });
  } catch (error) {
    console.error("🔥 sendMessage error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

//for getting messages of only the involved participants
export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [senderId, receiverId] },
    }).populate({
      path: "messages",
      populate: { path: "senderId", select: "username" },
    });

    if (!conversation)
      return res.status(204).json({ messages: [], success: true });

    return res
      .status(200)
      .json({ success: true, messages: conversation?.messages });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const createGroup = async (req, res) => {
  try {
    const creatorId = req.id;
    const { name, participantIds } = req.body;

    if (!name || !participantIds || participantIds.length < 1) {
      return res
        .status(400)
        .json({ success: false, error: "Name and participants are required" });
    }

    if (!participantIds.includes(creatorId)) participantIds.push(creatorId);

    const group = await Conversation.create({
      name,
      isGroup: true,
      participants: participantIds,
    });

    return res.status(201).json({ success: true, group });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const { conversationId, message } = req.body;

    if (!message)
      return res
        .status(400)
        .json({ success: false, error: "Message text required" });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.isGroup)
      return res.status(404).json({ success: false, error: "Group not found" });

    if (!conversation.participants.includes(senderId))
      return res
        .status(403)
        .json({ success: false, error: "Not a participant" });

    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId,
      message,
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    return res.status(200).json({ success: true, newMessage });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const conversationId = req.params.id;

    const conversation = await Conversation.findById(conversationId).populate({
      path: "messages",
      populate: { path: "senderId", select: "username _id" },
    });

    if (!conversation || !conversation.isGroup)
      return res.status(404).json({ success: false, error: "Group not found" });
    if (!conversation.participants.includes(senderId))
      return res
        .status(403)
        .json({ success: false, error: "Not a participant" });

    return res
      .status(200)
      .json({ success: true, messages: conversation.messages });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const addGroupParticipant = async (req, res) => {
  try {
    const userId = req.id;
    const { conversationId, participantId } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.isGroup)
      return res.status(404).json({ success: false, error: "Group not found" });
    if (!conversation.participants.includes(userId))
      return res
        .status(403)
        .json({ success: false, error: "Not a participant" });

    if (!conversation.participants.includes(participantId)) {
      conversation.participants.push(participantId);
      await conversation.save();
    }

    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const removeGroupParticipant = async (req, res) => {
  try {
    const userId = req.id;
    const { conversationId, participantId } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.isGroup)
      return res.status(404).json({ success: false, error: "Group not found" });
    if (!conversation.participants.includes(userId))
      return res
        .status(403)
        .json({ success: false, error: "Not a participant" });

    conversation.participants = conversation.participants.filter(
      (p) => p.toString() !== participantId
    );
    await conversation.save();

    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const renameGroup = async (req, res) => {
  try {
    const userId = req.id;
    const { conversationId, newName } = req.body;

    if (!newName) {
      return res
        .status(400)
        .json({ success: false, error: "New group name is required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ success: false, error: "Group not found" });
    }

    if (!conversation.participants.includes(userId)) {
      return res
        .status(403)
        .json({ success: false, error: "Not a participant of the group" });
    }

    conversation.name = newName;
    await conversation.save();

    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
export const getChatPreviews = async (req, res) => {
  try {
    const userId = req.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants")
      .sort({ updatedAt: -1 });

    const previews = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .lean();

        const status =
          lastMessage?.senderId.toString() === userId
            ? lastMessage?.seenBy?.includes(userId)
              ? "seen"
              : "sent"
            : lastMessage?.seenBy?.includes(userId)
            ? "seen"
            : "unread";

        let unreadCount = 0;
        if (lastMessage && lastMessage.senderId.toString() !== userId) {
          unreadCount = await Message.countDocuments({
            conversationId: conv._id,
            senderId: { $ne: userId },
            seenBy: { $ne: userId },
          });
        }

        // For group chats
        if (conv.isGroup) {
          return {
            group: {
              _id: conv._id,
              name: conv.name,
              profilePicture: "/group-avatar.png", // or conv.groupImage if available
              isGroup: true,
            },
            lastMessage: lastMessage
              ? {
                  ...lastMessage,
                  status,
                  unreadCount,
                }
              : null,
          };
        }

        // For one-on-one chats
        const otherUser = conv.participants.find(
          (p) => p._id.toString() !== userId
        );

        return {
          user: {
            _id: otherUser._id,
            username: otherUser.username,
            profilePicture: otherUser.profilePicture,
          },
          lastMessage: lastMessage
            ? {
                ...lastMessage,
                status,
                unreadCount,
              }
            : null,
        };
      })
    );

    const filtered = previews.filter(Boolean).sort((a, b) => {
      const aTime = a?.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt)
        : new Date(0); // fallback to oldest
      const bTime = b?.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt)
        : new Date(0);
      return bTime - aTime;
    });

    return res.status(200).json({ success: true, previews: filtered });
  } catch (err) {
    console.error("🔥 getChatPreviews error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const markMessagesAsSeen = async (req, res) => {
  try {
    const receiverId = req.id;
    const senderId = req.params.userId;

    await Message.updateMany(
      {
        senderId,
        receiverId,
        seenBy: { $ne: receiverId },
      },
      { $push: { seenBy: receiverId } }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("🔥 Seen update error:", err);
    return res.status(500).json({ success: false });
  }
};
