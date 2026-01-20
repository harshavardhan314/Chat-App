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

  // ---------------- GET USERS ----------------
  const getUsers = async () => {
    if (!authUser) return; // 🔥 wait for auth

    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users || []);
        setUnseenMessages(data.unseenmessageCounts || {});
      }
    } catch (err) {
      console.error(
        "Error in getUsers:",
        err.response?.status,
        err.response?.data || err.message
      );
      toast.error("Failed to load users");
    }
  };

  // ---------------- GET MESSAGES ----------------
  const getMessages = async (userId) => {
    if (!userId) return;

    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages || []);

        // 🔥 Clear unseen locally
        setUnseenMessages((prev) => ({
          ...prev,
          [userId]: 0,
        }));
      } else {
        toast.error(data.message || "Failed to load messages");
      }
    } catch (err) {
      console.error(
        "Error in getMessages:",
        err.response?.status,
        err.response?.data || err.message
      );
      toast.error("Failed to load messages");
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async (messageData) => {
    if (!selectedUser?._id) return;

    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.message || data.newMessage]);
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error(
        "Error in sendMessage:",
        err.response?.data || err.message
      );
      toast.error("Failed to send message");
    }
  };

  // ---------------- SOCKET LISTENER ----------------
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      // If current chat is open
      if (selectedUser && msg.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, { ...msg, seen: true }]);

        // 🔥 mark seen in backend
        axios.put(`/api/messages/mark/${msg._id}`).catch(console.error);
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
  }, [socket, selectedUser, axios]);

  // ---------------- LOAD USERS AFTER LOGIN ----------------
  useEffect(() => {
    if (authUser) getUsers();
  }, [authUser]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        getUsers,
        getMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
