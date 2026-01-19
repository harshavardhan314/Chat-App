import { createContext, useEffect, useState } from "react";
import axiosLib from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const axios = axiosLib.create({ baseURL: backendUrl });

  // Attach JWT to requests
  axios.interceptors.request.use((config) => {
    const t = localStorage.getItem("token");
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
  });

  const checkAuth = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  const login = async (type, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${type}`, credentials);
      if (!data.success) return toast.error(data.message);

      setAuthUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);

      connectSocket(data.user);
      toast.success(data.message);
    } catch {
      toast.error("Authentication failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    socket?.disconnect();
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/updateProfile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      }
    } catch {
      toast.error("Profile update failed");
    }
  };

  const connectSocket = (user) => {
    if (!user || socket?.connected) return;

    const newSocket = io(backendUrl, { query: { userId: user._id } });
    newSocket.on("online-users", setOnlineUsers);
    setSocket(newSocket);
  };

  useEffect(() => { checkAuth(); }, [token]);

  return (
    <AuthContext.Provider
      value={{
        axios,
        authUser,
        token,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
