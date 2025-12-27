import React, { useState, useRef, useEffect } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";

/* -------- DUMMY CURRENT USER (NO AUTH) -------- */
const CURRENT_USER = {
  _id: "680f5116f10f3cd28382ed02",
  name: "You",
  profilePic: assets.avatar_icon,
};

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const [message, setMessage] = useState("");
  const scrollEnd = useRef(null);

  /* -------- AUTO SCROLL -------- */
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesDummyData]);

  /* -------- EMPTY STATE -------- */
  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full">
        <img src={assets.logo_icon} alt="logo" className="w-16" />
        <p className="text-lg font-medium text-white">
          Chat anytime, anywhere...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative backdrop-blur-lg">

      {/* ---------- HEADER ---------- */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-white/10 z-20 bg-black/30 backdrop-blur-md">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-9 h-9 rounded-full"
        />
        <div className="flex-1">
          <p className="text-white font-medium flex items-center gap-2">
            {selectedUser.fullName}
            <span className="w-2 h-2 rounded-full bg-green-500" />
          </p>
        </div>
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
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="flex flex-col gap-6">
          {messagesDummyData.map((msg, index) => {
            const isMe = msg.senderId === CURRENT_USER._id;

            return (
              <div
                key={index}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex flex-col gap-2 max-w-[320px] ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  {/* IMAGE MESSAGE */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="message"
                      className="rounded-2xl max-w-full"
                    />
                  )}

                  {/* TEXT MESSAGE */}
                  {msg.text && (
                    <p
                      className={`px-4 py-2 text-sm text-white rounded-2xl ${
                        isMe
                          ? "bg-violet-600 rounded-br-md"
                          : "bg-slate-700 rounded-bl-md"
                      }`}
                    >
                      {msg.text}
                    </p>
                  )}

                  {/* META */}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {!isMe && (
                      <img
                        src={selectedUser.profilePic || assets.avatar_icon}
                        className="w-5 h-5 rounded-full"
                      />
                    )}
                    <span>{formatMessageTime(msg.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollEnd} />
        </div>
      </div>

      {/* ---------- STICKY INPUT ---------- */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/10 p-4 flex items-center gap-3 bg-black/50 backdrop-blur-md z-20">
        <div className="flex-1 flex items-center bg-white/10 rounded-full px-4">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message"
            className="flex-1 bg-transparent py-3 text-sm text-white outline-none"
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              className="w-5 cursor-pointer"
              alt="gallery"
            />
          </label>
          <input type="file" id="image" hidden />
        </div>

        <button className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
          <img src={assets.send_button} className="w-5" alt="send" />
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
