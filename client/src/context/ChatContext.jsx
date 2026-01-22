import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios, authUser } = useContext(AuthContext);

  // Get all users for sidebar
  const getUsers = async () => {
    if (!authUser) return;
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users || []);
        setUnseenMessages(data.unseenmessageCounts || {});
      }
    } catch (err) {
      console.error("getUsers error:", err);
      toast.error("Failed to load users");
    }
  };

  // Get messages for selected user
  const getMessages = async (userId) => {
    if (!userId) return;
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("getMessages error:", err);
      toast.error("Failed to load messages");
    }
  };

  // Send message to selected user
  const sendMessage = async (messageData) => {
    if (!selectedUser?._id) return;
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage || data.message]);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("sendMessage error:", err);
      toast.error("Failed to send message");
    }
  };

  // Mark a message as seen by its ID
  const markMessageAsSeen = async (messageId) => {
    if (!messageId) return;
    try {
      await axios.put(`/api/messages/mark/${messageId}`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, seen: true } : msg
        )
      );
    } catch (err) {
      console.error("markMessageAsSeen error:", err);
    }
  };

  // When a user is selected
  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id);

    // Mark all unseen messages from this user as seen
    messages
      .filter((msg) => msg.senderId === selectedUser._id && !msg.seen)
      .forEach((msg) => markMessageAsSeen(msg._id));

    // Reset unseen counter
    setUnseenMessages((prev) => ({
      ...prev,
      [selectedUser._id]: 0,
    }));
  }, [selectedUser]);

  // Socket listener for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (selectedUser && msg.senderId === selectedUser._id) {
        // Mark message as seen immediately
        setMessages((prev) => [...prev, { ...msg, seen: true }]);
        markMessageAsSeen(msg._id);
      } else {
        // Increase unseen count
        setUnseenMessages((prev) => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("new-message", handleNewMessage);
    return () => socket.off("new-message", handleNewMessage);
  }, [socket, selectedUser]);

  // Load users on auth change
  useEffect(() => {
    if (authUser) getUsers();
  }, [authUser]);

  const value = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getUsers,
    getMessages,
    sendMessage,
    markMessageAsSeen,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
