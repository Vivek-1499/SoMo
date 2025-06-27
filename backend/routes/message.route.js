import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  sendMessage,
  getMessage,
  createGroup,
  sendGroupMessage,
  getGroupMessages,
  addGroupParticipant,
  removeGroupParticipant,
  renameGroup,
  getChatPreviews,
  markMessagesAsSeen,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send/:id", isAuthenticated, sendMessage); // Send personal message
router.post("/all/:id", isAuthenticated, getMessage); // Get messages between two users

router.post("/group/create", isAuthenticated, createGroup); // Create group
router.post("/group/send", isAuthenticated, sendGroupMessage); // Send message to group
router.get("/group/:id", isAuthenticated, getGroupMessages); // Get group messages

router.put("/group/add", isAuthenticated, addGroupParticipant); // Add participant to group
router.put("/group/remove", isAuthenticated, removeGroupParticipant); // Remove participant from group
router.put("/group/rename", isAuthenticated, renameGroup); //  Rename group
router.get("/previews", isAuthenticated, getChatPreviews);
router.put("/seen/:id", isAuthenticated, markMessagesAsSeen);
export default router;
