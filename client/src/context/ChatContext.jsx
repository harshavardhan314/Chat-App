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

  

 
  useEffect(() => {
    if (!selectedUser) return;

   
    getMessages(selectedUser._id);

    
    axios.put(`/api/messages/mark/${selectedUser._id}`).catch(console.error);

    
    setUnseenMessages((prev) => ({
      ...prev,
      [selectedUser._id]: 0,
    }));
  }, [selectedUser]);

 
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
     
      if (selectedUser && msg.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, { ...msg, seen: true }]);

        axios.put(`/api/messages/mark/${msg.senderId}`).catch(console.error);
      }
     
      else {
        setUnseenMessages((prev) => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("new-message", handleNewMessage);
    return () => socket.off("new-message", handleNewMessage);
  }, [socket, selectedUser, axios]);

  

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
