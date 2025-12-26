import React, { useState } from "react";
import assets from "../assets/assets";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const [message, setMessage] = useState("");

  return selectedUser ? (
    <div className="h-full flex flex-col backdrop-blur-lg">

      {/* ---------- HEADER ---------- */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-8 rounded-full"
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="md:hidden w-6 cursor-pointer"
        />

        <img
          src={assets.help_icon}
          alt="help"
          className="hidden md:block w-5"
        />
      </div>

      {/* ---------- MESSAGES ---------- */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

        {/* Incoming message */}
        <div className="flex items-start gap-2">
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            className="w-7 rounded-full"
          />
          <div className="bg-white/20 text-white px-4 py-2 rounded-2xl max-w-[70%]">
            Hello! How are you?
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex justify-end">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl max-w-[70%]">
            I'm good 😄 What about you?
          </div>
        </div>

      </div>

      {/* ---------- INPUT ---------- */}
      <div className="p-3 border-t border-stone-500 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-transparent border border-stone-500 rounded-full px-4 py-2 text-white outline-none placeholder:text-gray-400"
        />

        <button className=" p-2 rounded-full">
          <img src={assets.send_button} className="w-10 h-10" />
        </button>
      </div>

    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">
        Chat anytime, anywhere...
      </p>
    </div>
  );
};

export default ChatContainer;
