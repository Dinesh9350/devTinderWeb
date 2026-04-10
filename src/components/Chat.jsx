import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import Login from "./Login";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      console.log(chat.data.messages);
      const chatMessages = chat?.data?.messages?.map((msg) => {
        const { senderId, text } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text: msg?.text,
        };
      });
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      fetchChatMessages();
    }
  }, [targetUserId]);
  useEffect(() => {
    if (!user) return;
    const socket = createSocketConnection();
    //as soon as page loaded, the socket connection is made and joinChat event is emmited
    socket.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });
    socket.on("messageReceieved", ({ firstName, text }) => {
      console.log(firstName + ": ", text);
      setMessages((prev) => [...prev, { firstName, text }]);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user?.firstName,
      lastName: user?.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="m-5 w-[80%] mx-auto border-2 border-white h-[80vh] flex flex-col">
      {/* Header */}
      <div className="p-5 border-b-2 border-white">
        Chat with {targetUserId}
      </div>

      {/* Messages (takes remaining space) */}
      <div className="flex-1 overflow-y-auto p-5">
        {messages?.map((msg, index) => {
          return (
            <div
              key={index}
              className={`chat ${user.firstName === msg?.firstName ? `chat-end` : `chat-start`} `}
            >
              <div className="chat-header">
                {msg?.firstName} {msg?.lastName}
                <time className="text-xs opacity-50 ml-2">2 hours ago</time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>

      {/* Input (always bottom) */}
      <div className="p-5 border-t-2 border-white">
        <div className="w-full flex items-center gap-4">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-black rounded-lg border-2 border-white py-1 px-2"
            type="text"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 rounded-lg px-4 py-1"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
