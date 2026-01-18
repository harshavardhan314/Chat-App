import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getMessages, getUserForSidebar, markMessagesAsSeen, sendMessage } from "../controllers/MessageControllers.js";

const messageRouter=express.Router();

messageRouter.get("/users",authenticate,getUserForSidebar);
messageRouter.get("/:id",authenticate,getMessages);
messageRouter.put("/markAsSeen/:id",authenticate,markMessagesAsSeen);
messageRouter.post("/send/:id",authenticate,sendMessage);


export default messageRouter;