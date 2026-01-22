import Message from "../models/Message.js";
import User from "../models/UserModel.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";
import { io, onlineUsers } from "../server.js";

// get users for sidebar with unseen message counts
export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenmessageCounts = {};
    await Promise.all(
      users.map(async (user) => {
        const count = await Message.countDocuments({
          senderId: user._id,
          receiverId: userId,
          seen: false,
        });
        if (count > 0) unseenmessageCounts[user._id] = count;
      })
    );

    res.json({ success: true, users, unseenmessageCounts });
  } catch (error) {
    console.error("Error in getUserForSidebar:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// get messages between logged-in user and selected user
export const getMessages = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ success: false, message: "Invalid user ID" });

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// mark a message as seen by ID
export const markMessagesAsSeen = async (req, res) => {
  try {
    const id = req.params.id;
    await Message.findByIdAndUpdate(id, { seen: true });
    console.log(`Message ${id} marked as seen`);
    res.json({ success: true, message: "Message marked as seen" });
  } catch (error) {
    console.error("Error in markMessagesAsSeen:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// send a message to a user
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { text, image } = req.body;

    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({ senderId, receiverId, text, image: imageUrl });

    // Emit new message to receiver if online
    const receiverSocketId = onlineUsers[receiverId];
    if (receiverSocketId) io.to(receiverSocketId).emit("new-message", newMessage);

    res.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
