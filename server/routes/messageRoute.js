import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getMessages,
  getUserForSidebar,
  markMessagesAsSeen,
  sendMessage,
} from "../controllers/MessageControllers.js";

const router = express.Router();

router.get("/users", authenticate, getUserForSidebar);
router.get("/:id", authenticate, getMessages);
router.put("/mark/:id", authenticate, markMessagesAsSeen);
router.post("/send/:id", authenticate, sendMessage);

export default router;
