import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  /* ===================== CHECK AUTH ===================== */
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log("Error in checkAuth", error);
    }
  };

  /* ===================== LOGIN / SIGNUP ===================== */
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setAuthUser(data.user);
      setToken(data.token);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;

      localStorage.setItem("token", data.token);

      connectSocket(data.user);
      toast.success(data.message);
    } catch (error) {
      console.log("Error in login", error);
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };

  /* ===================== LOGOUT ===================== */
  const logout = () => {
    setAuthUser(null);
    setToken(null);
    setOnlineUsers([]);

    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];

    socket?.disconnect();
    setSocket(null);

    toast.success("Logged out successfully");
  };

  /* ===================== UPDATE PROFILE ===================== */
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/updateProfile", body);

      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error in updateProfile", error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  /* ===================== SOCKET ===================== */
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    setSocket(newSocket);

    newSocket.on("online-users", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  /* ===================== RESTORE TOKEN ON REFRESH ===================== */
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${savedToken}`;
      checkAuth();
    }
  }, []);

  const value = {
    authUser,
    token,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
